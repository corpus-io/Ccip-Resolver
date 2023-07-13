// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {ICcipResponseVerifier} from "./ICcipResponseVerifier.sol";
import {SupportsInterface, ISupportsInterface} from "../SupportsInterface.sol";

abstract contract CcipResponseVerifier is ICcipResponseVerifier, SupportsInterface {
    function supportsInterface(bytes4 interfaceID) public pure override(SupportsInterface, ISupportsInterface) returns (bool) {
        //Supports both ICcipResponseVerifier and ISupportsInterface
        return interfaceID == type(ICcipResponseVerifier).interfaceId || super.supportsInterface(interfaceID);
    }

    function onResolveWithProof(bytes calldata, bytes calldata) public pure virtual override returns (bytes4) {
        return this.resolveWithProof.selector;
    }
}
