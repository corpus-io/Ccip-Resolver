// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import {ResolverBase} from "../ResolverBase.sol";
import {IPubkeyResolver} from "./IPubkeyResolver.sol";

abstract contract PubkeyResolver is IPubkeyResolver, ResolverBase {
    struct PublicKey {
        bytes32 x;
        bytes32 y;
    }

    mapping(uint64 => mapping(bytes => mapping(bytes32 => PublicKey))) versionable_pubkeys;

    /**
     * Sets the SECP256k1 public key associated with an ENS node.
     * @param node The ENS node to query
     * @param x the X coordinate of the curve point for the public key.
     * @param y the Y coordinate of the curve point for the public key.
     */
    function setPubkey(bytes32 node, bytes32 x, bytes32 y) external virtual {
        bytes memory context = abi.encodePacked(msg.sender);
        versionable_pubkeys[recordVersions[context][node]][context][node] = PublicKey(x, y);
        emit PubkeyChanged(context, node, x, y);
    }

    /**
     * Returns the SECP256k1 public key associated with an ENS node.
     * Defined in EIP 619.
     * @param node The ENS node to query
     * @return x The X coordinate of the curve point for the public key.
     * @return y The Y coordinate of the curve point for the public key.
     */
    function pubkey(bytes calldata context, bytes32 node) external view virtual override returns (bytes32 x, bytes32 y) {
        uint64 currentRecordVersion = recordVersions[context][node];
        return (versionable_pubkeys[currentRecordVersion][context][node].x, versionable_pubkeys[currentRecordVersion][context][node].y);
    }

    function supportsInterface(bytes4 interfaceID) public view virtual override returns (bool) {
        return interfaceID == type(IPubkeyResolver).interfaceId || super.supportsInterface(interfaceID);
    }
}