// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IExtendedResolver, IResolverService} from "./IExtendedResolver.sol";
import {IContextResolver} from "./IContextResolver.sol";
import {SupportsInterface} from "./SupportsInterface.sol";
import {CcipResponseVerifier, ICcipResponseVerifier} from "./verifier/CcipResponseVerifier.sol";
import {ENS} from "@ensdomains/ens-contracts/contracts/registry/ENS.sol";
import {INameWrapper} from "@ensdomains/ens-contracts/contracts/wrapper/INameWrapper.sol";
import {BytesUtils} from "@ensdomains/ens-contracts/contracts/wrapper/BytesUtils.sol";

import {BytesLib} from "solidity-bytes-utils/contracts/BytesLib.sol";

/**
 * Implements an ENS resolver that directs all queries to a CCIP read gateway.
 * Callers must implement EIP 3668 and ENSIP 10.
 */
contract CcipResolver is IExtendedResolver, IContextResolver, SupportsInterface {
    using BytesUtils for bytes;

    struct CcipVerifier {
        string gatewayUrl;
        ICcipResponseVerifier verifierAddress;
    }
    event GraphQlUrlChanged(string newGraphQlUrl);
    event OwnerChanged(address newOwner);
    event VerifierAdded(bytes32 indexed node, string gatewayUrl, address verifierAddress);

    error OffchainLookup(address sender, string[] urls, bytes callData, bytes4 callbackFunction, bytes extraData);
    error InvalidOperation();

    ENS public ensRegistry;
    INameWrapper public nameWrapper;

    address public owner;
    string public graphqlUrl;

    mapping(bytes32 => CcipVerifier) public ccipVerifier;

    constructor(
        //The owner of the resolver
        address _owner,
        //The ENS registry
        ENS _ensRegistry,
        INameWrapper _nameWrapper,
        //The graphQl Url
        string memory _graphqlUrl
    ) {
        owner = _owner;
        ensRegistry = _ensRegistry;
        nameWrapper = _nameWrapper;
        graphqlUrl = _graphqlUrl;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    function setGraphUrl(string memory _graphqlUrl) external onlyOwner {
        graphqlUrl = _graphqlUrl;
        emit GraphQlUrlChanged(_graphqlUrl);
    }

    function setOwner(address _owner) external onlyOwner {
        owner = _owner;
        emit OwnerChanged(_owner);
    }

    function setVerifierForDomain(bytes32 node, address verifierAddress, string memory url) external {
        require(node != bytes32(0), "node is 0x0");
        require(verifierAddress != address(0), "verifierAddress is 0x0");

        require(msg.sender == getNodeOwner(node), "only subdomain owner");

        (bool success, bytes memory response) = verifierAddress.staticcall(
            abi.encodeWithSignature("supportsInterface(bytes4)", ICcipResponseVerifier.resolveWithProof.selector)
        );

        require(
            success && response.length == 32 && (response[response.length - 1] & 0x01) == 0x01,
            "verifierAddress is not a CCIP Verifier"
        );

        require(bytes(url).length > 0, "url is empty");

        CcipVerifier memory _ccipVerifier = CcipVerifier(url, ICcipResponseVerifier(verifierAddress));
        ccipVerifier[node] = _ccipVerifier;

        emit VerifierAdded(node, url, verifierAddress);
    }

    /**
     * Resolves a name, as specified by ENSIP 10.
     * @param name The DNS-encoded name to resolve.
     * @param data The ABI encoded data for the underlying resolution function (Eg, addr(bytes32), text(bytes32,string), etc).
     * @return The return data, ABI encoded identically to the underlying function.
     */
    function resolve(bytes calldata name, bytes calldata data) external view override returns (bytes memory) {
        (CcipVerifier memory _verifier, bytes32 node) = getVerifierOfDomain(name);

        address nodeOwner = getNodeOwner(node);

        bytes memory context = abi.encodePacked(nodeOwner);
        bytes memory callData = abi.encodeWithSelector(IResolverService.resolve.selector, context, data);

        string[] memory urls = new string[](1);
        urls[0] = _verifier.gatewayUrl;
        //TODO add move callback to external interface
        revert OffchainLookup(address(this), urls, callData, CcipResolver.resolveWithProof.selector, callData);
    }

    function getVerifierOfDomain(bytes calldata name) public view returns (CcipVerifier memory, bytes32) {
        uint offset = 0;

        while (offset < name.length - 1) {
            bytes32 node = name.namehash(offset);

            CcipVerifier memory _ccipVerifier = ccipVerifier[node];
            if (address(_ccipVerifier.verifierAddress) != address(0)) {
                return (_ccipVerifier, node);
            }
            (, offset) = name.readLabel(offset);
        }

        revert InvalidOperation();
    }

    /**
     * Callback used by CCIP read compatible clients to verify and parse the response.
     * extraData -> the original call data
     */
    function resolveWithProof(bytes calldata response, bytes calldata extraData) external view returns (bytes memory) {
        (, bytes memory data) = abi.decode(extraData[4:], (bytes, bytes));

        bytes32 node = bytes32(BytesLib.slice(data, 4, 32));
        CcipVerifier memory _ccipVerifier = ccipVerifier[node];

        return ICcipResponseVerifier(_ccipVerifier.verifierAddress).resolveWithProof(response, extraData);
    }

    function supportsInterface(bytes4 interfaceID) public pure override returns (bool) {
        return interfaceID == type(IExtendedResolver).interfaceId || super.supportsInterface(interfaceID);
    }

    function metadata() external view returns (string memory, uint256, string memory, uint8, bytes memory) {
        return (
            string("OPTIMISM RESOLVER"), //The name of the resolver
            uint256(60), //Resolvers coin type => Etheruem
            graphqlUrl, //The GraphQl Url
            uint8(0), //Storage Type 0 => EVM
            bytes(string.concat("OPTIMISM RESOLVER: ", "{NODE_OWNER}"))
        );
    }

    function getNodeOwner(bytes32 node) internal view returns (address nodeOwner) {
        nodeOwner = ensRegistry.owner(node);
        if (nodeOwner == address(nameWrapper)) {
            nodeOwner = nameWrapper.ownerOf(uint256(node));
        }
    }
}
