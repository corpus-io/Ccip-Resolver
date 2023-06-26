import { expect } from "chai";
import { ethers } from "hardhat";
import { BedrockProofVerifier, L2PublicResolver, L2PublicResolver__factory } from "typechain";
import { getPublicResolverAddress } from "../../gateway/constants";
import { EnsResolverService } from "../../gateway/service/ens/EnsService";
import { ProofService, StorageLayout } from "../../gateway/service/proof/ProofService";
import { dnsEncode } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const PUBLIC_RESOLVER_ADDRESS = getPublicResolverAddress();

const PROOF_SERVICE_TEST_CONTRACT = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
describe("ProofServiceTest", () => {
    let BedrockProofVerifier: BedrockProofVerifier;
    let publicResolver: L2PublicResolver;

    const l1Provider = new ethers.providers.StaticJsonRpcProvider("http://localhost:8545");
    const l2Provider = new ethers.providers.StaticJsonRpcProvider("http://localhost:9545");

    //0x8111DfD23B99233a7ae871b7c09cCF0722847d89
    const alice = new ethers.Wallet("0xfd9f3842a10eb01ccf3109d4bd1c4b165721bf8c26db5db7570c146f9fad6014");

    beforeEach(async () => {
        //See github.com/ethereum-optimism/optimism/op-bindings/predeploys/dev_addresses.go
        const BedrockProofVerifierFactory = await ethers.getContractFactory("BedrockProofVerifier");
        BedrockProofVerifier = (await BedrockProofVerifierFactory.deploy(
            "0x6900000000000000000000000000000000000000"
        )) as BedrockProofVerifier;

        const factory = (await ethers.getContractFactory("L2PublicResolver")) as L2PublicResolver__factory;
        publicResolver = await factory.attach(PUBLIC_RESOLVER_ADDRESS).connect(l2Provider);
    });

    it("bytes32 slot", async () => {
        const proofService = new ProofService(l1Provider, l2Provider);
        const { proof } = await proofService.createProof(PROOF_SERVICE_TEST_CONTRACT, ethers.constants.HashZero, StorageLayout.FIXED);

        const responseBytes = await BedrockProofVerifier.getProofValue(proof);
        console.log(responseBytes);
        expect(responseBytes).to.equal(ethers.utils.namehash("alice.eth"));
    })

    it("empy slot", async () => {
        const proofService = new ProofService(l1Provider, l2Provider);

        const node = ethers.utils.namehash("alice1234.eth");
        const recordName = "empy-slot";


        const slot = EnsResolverService.getStorageSlotForText(2, 0, alice.address, node, recordName);
        const { proof } = await proofService.createProof(PUBLIC_RESOLVER_ADDRESS, slot);

        expect(proof.length).to.be.equal(0);

        const responseBytes = await BedrockProofVerifier.getProofValue(proof);
        const responseString = Buffer.from(responseBytes.slice(2), "hex").toString();

        expect(responseString).to.equal("");
    });
    it("sinlge slot", async () => {
        const proofService = new ProofService(l1Provider, l2Provider);

        const recordName = "foo";

        const node = ethers.utils.namehash("alice.eth")

        const slot = EnsResolverService.getStorageSlotForText(2, 0, alice.address, node, recordName);
        const { proof } = await proofService.createProof(PUBLIC_RESOLVER_ADDRESS, slot);

        expect(proof.length).to.be.equal(3);

        const responseBytes = await BedrockProofVerifier.getProofValue(proof);
        const responseString = Buffer.from(responseBytes.slice(2), "hex").toString();

        expect(responseString).to.eql("bar");
    });
    it("sinlge slot 31 bytes long", async () => {
        const proofService = new ProofService(l1Provider, l2Provider);

        const recordName = "my-slot";

        const node = ethers.utils.namehash("alice.eth")

        const slot = EnsResolverService.getStorageSlotForText(2, 0, alice.address, node, recordName);
        const { proof } = await proofService.createProof(PUBLIC_RESOLVER_ADDRESS, slot);

        const responseBytes = await BedrockProofVerifier.getProofValue(proof);
        const responseString = Buffer.from(responseBytes.slice(2), "hex").toString();

        expect(responseString).to.eql("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    });
    it("multislot slot", async () => {
        const proofService = new ProofService(l1Provider, l2Provider);

        const node = ethers.utils.namehash("alice.eth");
        const recordName = "network.dm3.eth";

        const slot = EnsResolverService.getStorageSlotForText(2, 0, alice.address, node, recordName);
        const { proof } = await proofService.createProof(PUBLIC_RESOLVER_ADDRESS, slot);
        const responseBytes = await BedrockProofVerifier.getProofValue(proof);
        const profile = {
            publicSigningKey: "0ekgI3CBw2iXNXudRdBQHiOaMpG9bvq9Jse26dButug=",
            publicEncryptionKey: "Vrd/eTAk/jZb/w5L408yDjOO5upNFDGdt0lyWRjfBEk=",
            deliveryServices: ["foo.dm3"],
        };
        const responseString = Buffer.from(responseBytes.slice(2), "hex").toString();

        expect(responseString).to.eql(JSON.stringify(profile));
    });
});
