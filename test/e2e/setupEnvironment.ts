import { ethers } from "hardhat";
import { dnsWireFormat } from "../helper/encodednsWireFormat";
import { L2PublicResolver, L2PublicResolver__factory, ProofServiceTestContract, ProofServiceTestContract__factory } from "typechain";
import { dnsEncode, keccak256, toUtf8Bytes } from "ethers/lib/utils";
/**
 * This script is used to setup the environment for the e2e tests.
 * It asumes that you've set up the local development environment for OP bedrock
 * https://community.optimism.io/docs/developers/build/dev-node/
 * */

//0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
const whale = new ethers.Wallet("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");

//0x8111DfD23B99233a7ae871b7c09cCF0722847d89
const alice = new ethers.Wallet("0xfd9f3842a10eb01ccf3109d4bd1c4b165721bf8c26db5db7570c146f9fad6014");
//0x504846E80A4eE8C6Eb46ec4AD64150d3f554F6b8
const bob = new ethers.Wallet("0xb03367a9007c929dfdb33237ed31e27a3d1e62f5a69ca00bb90001d6063dda4e");

const l1Provider = new ethers.providers.StaticJsonRpcProvider("http://localhost:8545");
const l2Provider = new ethers.providers.StaticJsonRpcProvider("http://localhost:9545");

const setupEnvironment = async () => {
    //The resolver that is linked in the OptimismResolver contract
    let l2PublicResolver: L2PublicResolver;
    //Another resolver contract not related to the OptimismResolver contract
    let foreignResolver: L2PublicResolver

    //Test proof logic

    let proofServiceTestContract: ProofServiceTestContract;

    const l2Whale = whale.connect(l2Provider);

    //Verifiy that the local development environment is set up correctly
    if ((await l1Provider.getNetwork()).chainId !== 900 || (await l2Provider.getNetwork()).chainId !== 901) {
        console.error("Please ensure that you're running the local development environment for OP bedrock");
        return;
    }

    const factory = (await ethers.getContractFactory("L2PublicResolver")) as L2PublicResolver__factory;
    l2PublicResolver = await factory.connect(l2Whale).deploy();
    await l2PublicResolver.deployed();
    console.log(`L2 Resolver deployed at ${l2PublicResolver.address}`);

    foreignResolver = await factory.connect(l2Whale).deploy();
    await foreignResolver.deployed();
    console.log(`L2 Foreign resolver deployed at ${foreignResolver.address}`);


    const proofServiceTestContractFactory = (await ethers.getContractFactory("ProofServiceTestContract")) as ProofServiceTestContract__factory;
    proofServiceTestContract = await proofServiceTestContractFactory.connect(l2Whale).deploy();
    console.log(`ProofServiceTestContract deployed at ${proofServiceTestContract.address}`);

    //Fund alice account
    const fundTx = await l2Whale.sendTransaction({
        to: alice.address,
        value: ethers.utils.parseEther("100"),
    });

    await fundTx.wait();
    console.log(`${alice.address} funded with ${await l2Provider.getBalance(alice.address)}`);
    //Fund bob account
    const fundTxbob = await l2Whale.sendTransaction({
        to: bob.address,
        value: ethers.utils.parseEther("100"),
    });

    await fundTxbob.wait();
    console.log(`${bob.address} funded with ${await l2Provider.getBalance(bob.address)}`);

    //Create data on L2 that later be used for the tests
    const prepareTestPrimitiveSlot = async () => {
        //Prepare test single slot
        const name = dnsEncode("bob.eth");
        const tx = await l2PublicResolver.connect(alice.connect(l2Provider)).clearRecords(name);
        const rec = await tx.wait();
        console.log(rec.events);


    };
    const prepareTestSingleSlot = async () => {
        //Prepare test single slot
        const name = dnsEncode("alice.eth");

        const recordName = "foo";
        const value = "bar";
        await l2PublicResolver.connect(alice.connect(l2Provider)).setText(name, recordName, value);

    };

    //Prepare test 31 byte
    const prepareTest31yte = async () => {
        const name = dnsEncode("alice.eth");
        const recordName = "my-slot";
        const value = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

        await l2PublicResolver.connect(alice.connect(l2Provider)).setText(name, recordName, value);
    };

    //Prepare test multiple slots
    const prepeTestMultipleSlots = async () => {
        const name = dnsEncode("alice.eth");
        const recordName = "network.dm3.eth";

        const profile = {
            publicSigningKey: "0ekgI3CBw2iXNXudRdBQHiOaMpG9bvq9Jse26dButug=",
            publicEncryptionKey: "Vrd/eTAk/jZb/w5L408yDjOO5upNFDGdt0lyWRjfBEk=",
            deliveryServices: ["foo.dm3"],
        };

        await l2PublicResolver.connect(alice.connect(l2Provider)).setText(name, recordName, JSON.stringify(profile));
    };

    //Prepare setAddr
    const prepareSetAddr = async () => {
        const name = dnsEncode("alice.eth");
        const tx = await l2PublicResolver.connect(alice.connect(l2Provider))["setAddr(bytes,address)"](name, alice.
            address);

    };
    const prepareSetAbi = async () => {
        const name = dnsEncode("alice.eth");
        const abi = l2PublicResolver.interface.format(ethers.utils.FormatTypes.json);

        const tx = await l2PublicResolver.connect(alice.connect(l2Provider)).setABI(name, 1, ethers.utils.toUtf8Bytes(abi.toString()));
        const rec = await tx.wait();
    }
    const prepareSetContentHash = async () => {
        const name = dnsEncode("alice.eth");


        const tx = await l2PublicResolver.connect(alice.connect(l2Provider)).setContenthash(name, "0xe3010170122029f2d17be6139079dc48696d1f582a8530eb9805b561eda517e22a892c7e3f1f")
        const rec = await tx.wait();
    }
    const prepareSetName = async () => {
        const nodeName = dnsEncode("alice.eth");
        const name = "alice";

        const tx = await l2PublicResolver.connect(alice.connect(l2Provider)).setName(nodeName, name)
        const rec = await tx.wait();

    }
    const prepareSetPubkey = async () => {
        const name = dnsEncode("alice.eth");

        const x = ethers.utils.formatBytes32String("foo");
        const y = ethers.utils.formatBytes32String("bar");

        const tx = await l2PublicResolver.connect(alice.connect(l2Provider)).setPubkey(name, x, y)
        const rec = await tx.wait();
    }
    const prepareSetDNS = async () => {
        const node = ethers.utils.namehash("alice.eth");

        const record = dnsWireFormat("a.example.com", 3600, 1, 1, "1.2.3.4")

        const tx = await l2PublicResolver.connect(alice.connect(l2Provider)).setDNSRecords(
            node,
            "0x" + record
        )
        const rec = await tx.wait();
    }
    const prepareSetZonehash = async () => {
        const node = ethers.utils.namehash("alice.eth");

        const record = dnsWireFormat("a.example.com", 3600, 1, 1, "1.2.3.4")

        const tx = await l2PublicResolver.connect(alice.connect(l2Provider)).setZonehash(
            node,
            keccak256(toUtf8Bytes("foo"))
        )
        const rec = await tx.wait();
    }

    const prepareTestSubdomain = async () => {
        const name = dnsEncode("a.b.c.alice.eth");
        const recordName = "my-slot";
        const value = "my-subdomain-record";

        await l2PublicResolver.connect(alice.connect(l2Provider)).setText(name, recordName, value);
    };
    const prepareTestSubdomain2 = async () => {
        const name = dnsEncode("alice.eth");

        const recordName = "bobs-slot";
        const value = "bobs-subdomain-record";



        await l2PublicResolver.connect(bob.connect(l2Provider)).setText(name, recordName, value);
    };
    const nameWrapperProfile = async () => {
        const name = dnsEncode("namewrapper.alice.eth");
        const recordName = "namewrapper-slot";
        const value = "namewrapper-subdomain-record";

        await l2PublicResolver.connect(alice.connect(l2Provider)).setText(name, recordName, value);
    }
    //Prepare foreign resolver
    const prepareForeign = async () => {
        const name = dnsEncode("alice.eth");
        await foreignResolver.connect(alice.connect(l2Provider))["setAddr(bytes,address)"](name, alice.address);
    };

    const prepateProofServiceTestContractBytes32 = async () => {
        await proofServiceTestContract.setBytes32(ethers.utils.namehash("alice.eth"));
        await proofServiceTestContract.setBool(true)
        await proofServiceTestContract.setUint256(123)
    }
    await prepareTestPrimitiveSlot();
    await prepareTestSingleSlot();
    await prepareTest31yte();
    await prepeTestMultipleSlots();
    await prepareSetAddr();
    await prepareSetAbi();
    await prepareSetContentHash();
    await prepareSetName();
    await prepareSetPubkey();
    await prepareSetDNS();
    await prepareSetZonehash();
    await prepareTestSubdomain();
    await prepareTestSubdomain2();
    await nameWrapperProfile();
    await prepareForeign();

    await prepateProofServiceTestContractBytes32();


    console.log("Environment setup complete wait a few minutes until everything is set");
};


setupEnvironment();
