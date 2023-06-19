import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers.js";
import { ethers } from "hardhat";

import { L2PublicResolver } from "typechain";

import { expect } from "chai";

describe("L2PublicResolver", () => {
    let user1: SignerWithAddress;
    let user2: SignerWithAddress;
    let l2PublicResolver: L2PublicResolver;

    beforeEach(async () => {
        [user1, user2] = await ethers.getSigners();
        const l2PublicResolverFactory = await ethers.getContractFactory("L2PublicResolver", user1);
        l2PublicResolver = (await l2PublicResolverFactory.deploy()) as L2PublicResolver;
    });

    describe("TextResolver", () => {
        it("set text record on L2", async () => {
            const node = ethers.utils.namehash(ethers.utils.nameprep("dm3.eth"));


            // record should initially be empty
            expect(await l2PublicResolver.text(user1.address, node, "network.dm3.profile")).to.equal("");

            const tx = await l2PublicResolver.connect(user1).setText(node, "network.dm3.profile", "test");
            const receipt = await tx.wait();

            const [textChangedEvent] = receipt.events;

            const [context, eventNode, _, eventKey, eventValue] = textChangedEvent.args;

            expect(ethers.utils.getAddress(context)).to.equal(user1.address);
            expect(eventNode).to.equal(node);
            expect(eventKey).to.equal("network.dm3.profile");
            expect(eventValue).to.equal("test");

            // record of the owned node should be changed
            expect(await l2PublicResolver.text(user1.address, node, "network.dm3.profile")).to.equal("test");
        });
    });

    describe("AddrResolver", () => {
        it("set addr record on L2", async () => {
            const node = ethers.utils.namehash(ethers.utils.nameprep("dm3.eth"));


            // record should initially be empty
            expect(await l2PublicResolver["addr(bytes,bytes32)"](
                user1.address, node
            )).to.equal(
                "0x0000000000000000000000000000000000000000"
            );


            const tx = await l2PublicResolver["setAddr(bytes32,address)"](node, user2.address);
            const receipt = await tx.wait();
            const [addressChangedEvent, addrChangedEvent] = receipt.events;

            let [eventContext, eventNode, eventCoinType, eventAddress] = addressChangedEvent.args;


            expect(ethers.utils.getAddress(eventContext)).to.equal(user1.address);
            expect(eventNode).to.equal(node);
            expect(eventCoinType).to.equal(60);
            expect(ethers.utils.getAddress(eventAddress)).to.equal(user2.address);

            [eventContext, eventNode, eventAddress] = addrChangedEvent.args;

            expect(ethers.utils.getAddress(eventContext)).to.equal(user1.address);
            expect(eventNode).to.equal(node);
            expect(ethers.utils.getAddress(eventAddress)).to.equal(user2.address);
            // record of the owned node should be changed
            expect(await l2PublicResolver["addr(bytes,bytes32)"](user1.address, node)).to.equal(user2.address);
        });
    });
    describe("ABIResolver", () => {
        it("set abi record on L2", async () => {
            const node = ethers.utils.namehash(ethers.utils.nameprep("dm3.eth"));

            const abi = l2PublicResolver.interface.format(ethers.utils.FormatTypes.json);
            const tx = await l2PublicResolver.connect(user1).setABI(node, 1, ethers.utils.toUtf8Bytes(abi.toString()));

            const receipt = await tx.wait();
            const [addressChangedEvent] = receipt.events;

            const [context, eventNode, eventContentType] = addressChangedEvent.args;

            expect(ethers.utils.getAddress(context)).to.equal(user1.address);
            expect(eventNode).to.equal(node);
            expect(eventContentType).to.equal(1);

            const [actualContentType, actualAbi] = await l2PublicResolver.ABI(user1.address, node, 1);

            expect(actualContentType).to.equal(1);
            expect(Buffer.from(actualAbi.slice(2), "hex").toString()).to.equal(abi.toString());
        });
    });
    describe.skip("ContentHash", () => {
        it("set contentHash on L2", async () => {
            const node = ethers.utils.namehash(ethers.utils.nameprep("dm3.eth"));
            const ownedNode = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(["bytes32", "address"], [node, user1.address])
            );
            const contentHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("test"));
            const tx = await l2PublicResolver.setContenthash(node, contentHash);

            const receipt = await tx.wait();
            const [contentHashChangedEvent] = receipt.events;

            const [eventNode, eventownedNode, eventHash] = contentHashChangedEvent.args;

            expect(eventNode).to.equal(node);
            expect(eventownedNode).to.equal(ownedNode);
            expect(eventHash).to.equal(eventHash);

            const actualContentHash = await l2PublicResolver.contenthash(ownedNode);

            expect(actualContentHash).to.equal(contentHash);
        });
    });
    describe.skip("Interface", () => {
        it("set interface on L2", async () => {
            const node = ethers.utils.namehash(ethers.utils.nameprep("dm3.eth"));
            const ownedNode = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(["bytes32", "address"], [node, user1.address])
            );
            const interfaceId = "0x9061b923";
            const tx = await l2PublicResolver.setInterface(node, interfaceId, user2.address);

            const receipt = await tx.wait();
            const [interfaceChangedEvent] = receipt.events;

            const [eventNode, eventownedNode, eventInterfaceId, eventImplementer] = interfaceChangedEvent.args;

            expect(eventNode).to.equal(node);
            expect(eventownedNode).to.equal(ownedNode);
            expect(eventInterfaceId).to.equal(interfaceId);
            expect(eventImplementer).to.equal(user2.address);

            const actualImplementer = await l2PublicResolver.interfaceImplementer(ownedNode, interfaceId);

            expect(actualImplementer).to.equal(user2.address);
        });
    });
    describe.skip("Name", () => {
        it("set name on L2", async () => {
            const node = ethers.utils.namehash(ethers.utils.nameprep("dm3.eth"));
            const ownedNode = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(["bytes32", "address"], [node, user1.address])
            );
            const tx = await l2PublicResolver.setName(node, "foo");

            const receipt = await tx.wait();
            const [nameChangedEvent] = receipt.events;

            const [eventNode, eventownedNode, eventNewName] = nameChangedEvent.args;

            expect(eventNode).to.equal(node);
            expect(eventownedNode).to.equal(ownedNode);
            expect(eventNewName).to.equal("foo");

            const actualName = await l2PublicResolver.name(ownedNode);

            expect(actualName).to.equal("foo");
        });
    });
    describe.skip("PubKey", () => {
        it("set pubKey on L2", async () => {
            const node = ethers.utils.namehash(ethers.utils.nameprep("dm3.eth"));
            const ownedNode = ethers.utils.keccak256(
                ethers.utils.defaultAbiCoder.encode(["bytes32", "address"], [node, user1.address])
            );

            const x = ethers.utils.formatBytes32String("foo");
            const y = ethers.utils.formatBytes32String("bar");

            const tx = await l2PublicResolver.setPubkey(node, x, y);

            const receipt = await tx.wait();
            const [pubKeyChangedChangedEvent] = receipt.events;

            const [eventNode, eventownedNode, eventX, eventY] = pubKeyChangedChangedEvent.args;

            expect(eventNode).to.equal(node);
            expect(eventownedNode).to.equal(ownedNode);
            expect(eventX).to.eql(x);
            expect(eventY).to.eql(y);

            const { x: actualX, y: actualY } = await l2PublicResolver.pubkey(ownedNode);

            expect(actualX).to.equal(x);
            expect(actualY).to.equal(y);
        });
    });
});
