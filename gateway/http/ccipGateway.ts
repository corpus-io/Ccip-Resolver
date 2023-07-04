import express from "express";

import { Config } from "../config/Config";
import { optimismBedrockHandler } from "../handler/optimism-bedrock/optimismBedrockHandler";
import { signingHandler } from "../handler/signing/signingHandler";
import { ethers } from "ethers";

export function ccipGateway(config: Config) {
    const router = express.Router();

    router.get("/:resolverAddr/:calldata", async (req: express.Request, res: express.Response) => {
        const { resolverAddr } = req.params;
        const calldata = req.params.calldata.replace(".json", "");
        console.log("inc rec", resolverAddr)

        try {
            const configEntry = config[resolverAddr];
            console.log(config)


            if (!configEntry) {
                return res.status(404).send({
                    message: "Unknown resolver selector pair",
                });
            }
            switch (configEntry.type) {
                case "signing": {
                    const response = await signingHandler(calldata, resolverAddr, configEntry);
                    res.status(200).send({ data: response });
                    break;
                }
                case "optimism-bedrock": {
                    //const response = await optimismBedrockHandler(calldata, resolverAddr, configEntry);
                    const response ="0x00000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000000000000000080000000000000000000000000000000000000000000000000000000000000001048656c6c6f2066726f6d20416c6963650000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000005fbdb2315678afecb367f032d93f642f64180aa30000000000000000000000000000000000000000000000000000000000000010ad35f0ac32c58ad963f403f26a74a61458671800c4c4cc35fea4f9e0e7e2787900000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000044000000000000000000000000000000000000000000000000000000000000000022a5e663e25e8eb18934a71fda0d154c87a6c1598932d5f662b266d7d2ceed838ed4baae3a927be3dea54996b4d5899f8c01e7594bf50b17dc1e741388ce3d12136d3cdbc1228de99cbe5872c8b4266038e885b15413407bba23f49360c67421000000000000000000000000000000000000000000000000000000000000076000000000000000000000000000000000000000000000000000000000000005c7f905c4b90214f90211a0ef6868732abdc70b6f1b09caf106da4c034213dd5d9b623a1682867d6ed55d3fa0c6ec7c903bd96816c1b3b9a6551a2fc59b0c8750bd1e5ccfbace768340d4b37aa0f81e937e2d5ff7c1f8a392103e8125cd54808452f10bafdc7dbb3f0fe6c4eb5ba0aad7e38748646832dd6ad7be7d51d4e18b205f0094aecaf65c9ec665f12cf4c0a0fb3a0dae45b3be717875b9ad3973b802a678feb54561904402159a9dd6379096a06e6d4b6c7a781500ca3288d65e40c36746a332e4b42ac409447cf3c68638619ea004873662e32a2c7b56263c834fa312775fca35d684a9441bebe0d065f5103671a0a8b25c14e60c6202ece38740446044af0b4768a057ac74d1cb3ca6144f3c4c2fa08ce392ca5602f648f2bdf12584c07043834c8fb1b78a0d9808b6e94507e3f895a03af80fdab00085f42072d43f8cfe6984c7467febeb0a00b8d7d89750f8a1ce0ca01f5b7ae3f9169e9781ca2bbcbde9fa9306d4c4187fc49ba6b6e6b23d5e949828a02910c1dc3fe0c125f7a5ec0ad1d108a0c65f65ee94a63d10298da93439f8e3c1a0ad5ccb80e68c6f36226137f8846944f3edda206e847ce3d89312186dacc697fda0f503a03e5f8d8c570949d4bbdfa6a2c0b05e43265d814e9a7f60c247f86bfc57a066199ae7c847dc0f0ead4e4b2f0ae0483ffb59c85dbe7fa15cee5e43eeeef368a0d376fc0cd000484cf77a923c29379f2c674cba4ae17f0673b224907e4a397beb80b90214f90211a07afb688f11f33a7744231214e5ca3c37f972d45b89bb0ebd68e447c080195f2fa0aceafea5a85ffdd6cd3ce5220261c4f9291adea473770398f156292c38629166a0f7b3c5fe4254bc5af6342b8066687267beea2a7a77e846ad75363c47c7168919a0bc35b4a4107c0dce7196ba45e100af2834a0c7bd94c0a8cd80b3c0bf897ee55aa0a2001786db32ddfc074c87c47660517c31d262c203c832c730092776fcac03b0a0c00244e65a9e4a610ac8b78cb303c2c8b6576d387927f69b415e42ec5189bb83a004450ea2e65883f407c084c6ee3e0812d8d4ce59840b0965e8dd0cf36ecfa44ba03a77a56ea41e00137d1fc6a0546fda4b157e01a5215d9cb1ea08d602b45912b5a0b8b7aa02e96fa355e0c25e0d33812f088059279aec8709bc0e9a2d411704ced3a0b814d826bc8f0e8608a7829bf5c9ef56b2dc204950e94d5fdfb565edbb9c4230a0ef070431ad00fdfcca7837fa522bbe5a0cb5cd385b43668df07230eb1803972fa01b8563aa5187e608f48219b3cc57e2b4737480506b8b1f540c7a3b184dc0f8a2a0f07779d40a9174eec403d9cf433586d3e38fa27eea29a6369892f40175508d70a0e36e9f20adf538b97ee6d1c4d6d1515c652a60a4edc14a7fc6abb92caf5774caa0b7aa2a6500d33c3f26b29b2610ec3d71fe1b65e06d9ec91e42cba4b9eb47913aa0d5664e4de78f354c402d0ba977ec2d34d7709081c56dd2e64330f65053f4be7c80b8d3f8d1a0792c8e61a974df657a6fee0328eee5e752f5b34551711a5cb24a8c274a271053a0a75cc730eefbec13267a487874dd8eb585bb46300003c8d8db070ea94cee24f2808080a092a0d963ac361f7f857d0d95dd96d1ca20f4997187404c62d5cd00a84dfab5aaa0da02b158b1b93131df5cc096df6e01ccc2a2a10fdd41ebe6ba22237c95bd64038080a08072676ae11b810b19b9f8bde0a8959acfd090de79b16e6863520eff52098c6a80808080a0c3eb16ecd0ec2d8d13585462853a00fc55c13101abe64d809ee0a879e3a94e718080b853f85180a09d3ebed768cfaf186a3aa1a9a0cb06c9fd42c64c964cd03e30356aab2c7ffa3080808080a0bbff103cf519f676bf1db0ef1ad78af523e93e2a1fa5f29d67a598bd9d66788b80808080808080808080b86af8689f2059e60b21cc961f64ad47f20523c1d329d4bbda245ef3940a76dc89d0911bb846f8440180a0ad35f0ac32c58ad963f403f26a74a61458671800c4c4cc35fea4f9e0e7e27879a016198b04009db6eeb9ed13e85a5e09c7a4181c097a11c623ea063c599f8f4675000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000050000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000000000000000011ff9011cb8d3f8d1a0e4e0ff9e1d33e9a07212097dac74829317fd4c9f718bb3cf8393fe8d08c2e0d180a04fc5f13ab2f9ba0c2da88b0151ab0e7cf4d85d08cca45ccd923c6ab76323eb2880a0099c6f74826fe6e5b84be232bce5310cb691c181393ea322210f8384a2ee3317808080a0d2a2881f58591ceed69e5e6c881165f99e18e9671ee5ad3543df3ed672802a248080a0d14edcd811d31c66a0b3c9ae24e8c6bb09104fcc17b71a5279a2eba94c4eee6aa0abbeef1fcbe5abf858a906c438233de68feb020efcb2c2150fb760933069b6d580808080b845f843a0336b6384b5eca791c62761152d0c79bb0604c104a5fb6f4eb0703f3154bb3db0a1a048656c6c6f2066726f6d20416c6963650000000000000000000000000000002000"
                    

                    console.log(response)

            
                    res.status(200).send({ data: response });
                    break;
                }

                default:
                    res.status(404).send({
                        message: "Unsupported entry type",
                    });
            }
        } catch (e) {
            req.app.locals.logger.warn((e as Error).message);
            res.status(400).send({ message: "Unknown error" });
        }
    });
    return router;
}
