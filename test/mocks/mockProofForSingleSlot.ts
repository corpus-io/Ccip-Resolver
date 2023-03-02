import { BigNumber } from "ethers";

export const mockProofForSingleSlot = {
    target: "0xb20eb9648b4a818aa621053f1aa1103c03f2df57",
    stateRoot: "0x5b0b337d3c3e4ff3ac00cd99cbd133c8cc3266f36ff42f2b9815de4a32e08fe3",
    storageProofs: [
        {
            key: "0x0d40db311f17e256a327b1e91bb48f95171475eeca0b6e07a3263604e4f6d0ab",
            value: "0x6261720000000000000000000000000000000000000000000000000000000006",
            storageTrieWitness:
                "0xf90191b8d3f8d1a045459b10071bebd589b18ddb155dda660185d53b860d888290372c6743ba6ab0808080a0d0f933755b30716b1b24fda1148b169025c09a85433c3bc3b3157dfbc02bd9e68080a05f8e58d49a0eda1e96e61f0fbd885fc26463b190891a5620353924ed37e24beb8080a0eb95a49f698c1991be8694a0f1b754d053b29c672d7eea779e3942d3f5e0dbeb808080a0c46f4cf75cac2cdc166b4d93ce3e1020a037932f9829a33f61840da724d26847a02ca01539227b17ff82887266bdb29342aba4e11643a762595daf5f485faf541280b873f8718080a05507d98d0282bc24a52ad072e5f2cfb9df3772c13476e898a170a0f9946b343880808080a0515de4c178c898e53cda89582c1099fd6ab20bd0910d4849e801e8b419962c4780a035c6957d9384b8db0df397858b8de6f062843771f7352316383727517f4d47d180808080808080b845f843a020afbc5a56f5cef7e914f1fa7850754ca6227abc40ea5114c8328126d2e29eaea1a06261720000000000000000000000000000000000000000000000000000000006",
        },
    ],
    stateRootBatchHeader: {
        //batchIndex: { type: "BigNumber", hex: "0x0145c2" },
        batchIndex: BigNumber.from("0x0145c2").toHexString(),
        batchRoot: "0x8198143402aa261bacb346a94e098dcd7eca9055a20f9b5defd691f36ec09635",
        //batchSize: { type: "BigNumber", hex: "0x03cb" },
        batchSize: BigNumber.from("0x03cb").toHexString(),
        //prevTotalElements: { type: "BigNumber", hex: "0x04a6a0bd" },
        prevTotalElements: BigNumber.from("0x04a6a0bd").toHexString(),
        extraData:
            "0x0000000000000000000000000000000000000000000000000000000063ffae47000000000000000000000000473300df21d047806a082244b417f96b32f13a33",
    },
    stateRootProof: {
        index: 0,
        siblings: [
            "0x905fe09b16ff7797e29e18b6c1a73009d066876297fbe8472f160196d360e8e3",
            "0xfb83171e1c8420f40e8b30abbf3376c5241c1a91c254d0dc50d576a256b5021b",
            "0x1f50258089f8c8373810a0ff52a4e889a78cb7479ef1c3f2f6df321cf4e082d0",
            "0x63aba7bbb41bbfea0366b6c181b0fa331c524da1ba0fe4ff3bebe015ef58a003",
            "0x677ff2b860a763b1c821b1f8edc0721fc84f44716076f3f0f59fcd0c12e790c5",
            "0xcaa168ddd6ff4fee1de16fe0790d0d30873d5a9944075e557d740518a0ca945b",
            "0x8819a9b71cd68e94545e0df1242a3351f2f1a46da78e724235989c74687d31a6",
            "0x135b2330f17a652ac8a85101320d4921ab12928fcba8eeac3af0eb8553c180c9",
            "0xeacca88eac38ce182e6368d8a13a5d0446829dcb0aea42ba09e38faaa3175188",
            "0x4643ad1b811ed7eec4c5f4c075819b13322ed24bc57388a1c537a9a10e9171ab",
        ],
    },
    stateTrieWitness:
        "0xf90b53b90214f90211a0cf9d574a700a50bb3e749d15e1d33f300be4504ed1f3faafa16c0813746d8764a082c4fb8242f70ad4e298a9e38d4652b66df34e8b196aa8c05c108f4673c553d1a04f490bc1b52894ab1455caa1a3b8b3e42d9ac5fc5e6eb9c5ab975d693a006591a065020a97144f01d765b12265cf26c78ae9b59e338f32c0edad958b3f08c460e5a067315dc441c0ba09ee708069a77c57a93af3d8efa8ea668e42a5c1b7b66b8503a08cc79f85b449741ce2aec742aec49983aded894997335fdc4049b1617bb536bba05ba0c014c232981b460792a462ed2a9e1c36d32d9b83f935a1894ca93686383da0eea504218bfa0ef8ee2c9030ed85d8631b7676513bf771fb1407602fc0512c95a0d471ff39c4345ab932900e52f7086623104ea1d177809103cb11bbb0f5b8d329a07caa8f6d38bdd798b5660e783ebff8a70bfc5128d4e15955edb5c1d80b5777e0a0eddac792a6979c4708824655ba47d34ac26de8e34d658d0e645ffa5e2dd6ca50a0089993f57a6e207d8d581cb36a32b46bde5cbddc06c56e883e353ca3ca36e689a0a84d158a56bb25b73ae43dd4aea00487a41804f28f8be2f95e64c6a0643c4169a0e661d492d15bc4ea143e661a25b5938d0b694170af7adf1410d204d70ed2445ea08beea250e5dc9669541a55ecfe6a6f4ccbad47358e3cbb7102af4918a3368764a0007456edcf64fb218b6ab27c9e833a90c91785aaf74f7f07ba1c05e137a5559980b90214f90211a0bbe7af9766c015e7c3bcf69e0d54a9359613d61adeae8e3dd6e6ac700ceeb5bca06bfc06ff2958d724419cc5d2521a9cd7a58f9da66b7e3199ea4065d36fcb2929a0f0732fa40ca19893351d15d816550106a1bcaebc3b9fcf5be2b2ff2cafe6571da0159d4169e12d0be7b6dff920a1f93cf9b39a305e2d4a647b688dcdcabf9f42f1a09c64b3246745a4b3019f00fbce6b7d6251e4304b2a72eddb2120937c04bd3048a09c013eca1323986df14d2aaa7f147077b106faa0b54e78adcd01684e869d19ada075f88cc3dae25e1fade610ca325f6c50b328c8f84b150f47fc132c369ee360a5a0dcc1f03d49986d95f6b4982dc7d11677dfa55d212c175aed7ee3fc6c27f2038ba066955403167d2e69d8be86bfa02ac98334ed8e8ac8852d0aba332dff356605b6a018dbcbea780df02d454d2b2822940d73f5c28e7358381d59ab60530b6b0900bda050a6c5dede4f2e1409a0212cf1407a1d7dcff76eee4b5b9dc51872bc6f028833a03558a842a9e927b7219bd3719212183e2f0bdbf858532998e7a3f4c55458277da00663c33be995ff82870ff3216c4c87dd2201ae4ecd9afc8a8a95226487be0fa6a0ea386fe97c7b859267bd98a84888b7c0fb355c026f4302746043ea9045cae0dca0274f95fc4d0ba9f16a89a12ac02ed2ad6fef8cccb526003a4e04f1e3ab1bf1c3a0f3f40c1ca9fa8c919622be3f50131eddb31f441af8a32d41445bfa0874013da780b90214f90211a0244ffaba2fdac46928e031024aaf47888308c7efb72b68598d42aa0e9106bc04a0ceaa6eacd712ba150ca677dfbd850a1f464230b5bbdf4656df10d7db13f13a1da081e6584908dc95dee6a01cf66cc4e752c935171485a6f3d48b047071a16d2af9a0d72b05dfa3fa1b2f2575a2cf5f33d805ef458e768ef4ed2a9cbf38c94a0064cda0753b637fad3a09fbcae399eca44b091562d09a7bf885386a7288e8eb99149275a0c0d0cd6e7a8a82995b11ef980526c458a15f76a57dc50c2f576311b3a4d13d75a0eef804cd9b5a7ae896a8669881a24c691ef6c6f0f80841335b2356d75b70f0cca0a0d0330c755d9d67208e674afe4df08bb1be14e8a8fe2ed06a54a55fe691b112a0d4babe1f7c8c95616d0adb3f3774cbe520d8a9c0bc0fef956abeff0b0fcebfc9a0d6b635fc9fbe9ec35f5fc29411a43f4ef12ceea34a6bbda0876123107217ab07a04990ab3c673b68b79b91e67ceb747c7cb8d3cb26325fd6fee524d8851041fe91a0f69beb621fb313a7b392d621663c8b1a97fcfaa62dbd3bdabf3dc13e6cdc6adba0fb80c5006963aa1adb634e2c79325c36ab6efa8dc33b7b8c0ecddc6efa97c932a08ac5526ab0c94494e0605b19c66cccf952ecdeca43c0542edc85c79e2d251a8ea0720bc3b4df4345b2cb6cfb81109067be5e6322247d9a271367348bc7b21d1934a0f4ec70a8d1a060a17ed914980bd496ed2c8132125490f7f09cdd5ebb4475291280b90214f90211a0fc9841be32ec4e83afabfb6257bf5237d266842d554dc0f9f3f85a3ec81de296a0f2f2a62f63b606adb7d3a2d848fac09cf7f6c868b44d1de2f2d06e16e8f17d1ca06409a532db119d7167c1e239e72f84c8ecad95b5104a49c3607c9da8ed6104c1a055e02017c5d3b2deb31968d5817e3814a496b4200a798504809604d66da9e674a07ad1db89b0a4178e892c4095fa1bb7a1a7aa2055efe0f13fcd6b9b5fd20b00a3a001acc3bfa13bbcbdb4653c03342d830e1b3489bc4b9e2d825f0270ca06dcccfba02348bf3d008fb70a2e01c0604fc39526329cd5821381371d2b0c1ce15c9fab2ca037517087825830200e532d2b5fa26651aa7a765fdc6cf022abd9df5f056196dfa0530743a5869b5f2ae54d681ad5b4d5cb436ae4deb2fbc369763ee6871481bbdfa08c4555daae7d34e4637537b6a65aa66fd886befb90dc86b92cd755cf8f44f70ea0b5b19ebf34849a2dd4f192f787e54d1d0a0b76d793fa35789dfa0974f7064eeea0fd9ecfb74b0f06f6d9559902ca81ba30695e256b167652b8b504289a85202be9a0373965e872a6c4fccf2f272cdb353fc0d74c0880357bfc9a210ae7d9ff716bfda00e36dde776b101d89d8fb94cda0e1dde9eec6b4449d935569bc10ecf91e79d0aa09ae85bd414d78caabf22f0c5dda7d20d87c93b11c767675bdb567c2850ab5ea8a088a313ce31a34b8a08af60b28e2859d0c66d47eb7a782446aed3151b8cec496d80b901d4f901d1a09e325fa8b809e165fbf4f744f2e57e7c09c6821a0654636022315c591c1db1a88080a0cd2720808e63987b37a9694afc43bfb6e0776a55c94811834220fae5268cca9da01918cae4a758d72aae957756df2ad1d4463307252f44377258e6a3826a86c7f2a0d209e60dca6804287a06b90aa62a134f77d223efa3cbeefeaea75c5c70de805fa04eeff7fe472acc5c732da1886a94aaf48b2e825f7c4c5b14d1b044f011dfdadea07af5777ec19b2212e4b4faed3803f3039c77fe082e1d4c45874c49f8770bd5c0a055ea8586498373f20fce08cb7a3d3d9c8a82b5302528d70e73fa81b52055c8dda01f5d1ca5c52f2d14ca3dff9f2cb107c1f7aed5660d40f1d5933c1363fe871736a0784fe7f7041f84639af811edf1f9c0b53fdcf062e31a1cef9fea1263d6fac5a8a07815b2c80a523ee7a6e9ea9b05415027e7f8f10b43cb6f550c2b604f9b145dcea089ee079fe5ec7df13827957cf84faa0c67ea86a26d8b5e76b12948f4423de716a084ca3d4bbc1fdca094022316e94ccc3cdbef9a0d7c9bf57d81618ecaecef55fda00d1ed9c664e7df17a402c41241889a588af4509d2452462be7690a6a1a55b3a5a0d4c03a8e9b6f04a37238516f2569d9e06c5aa2af926e47ab34bebb8b74191fde80b8b3f8b1a08d066fd02ea88f87c0be5d9154f26154f0e348ab2d654b3d0061b47f53bdcfb480a0a43a53cfd1c5d3f6f8f8d5201e9e8fc840e8221441482cd86c8775758d65158880a0f52722ff0ab7989a554ccdb44799e5b5f8006e22709a2c6643c785574bd3a8de8080808080a0a8da9548ecba4ef615ff9abe1d77931409f3e53d9d40ef7538cab8496a7201dda02b7b350d238e991a59c12c10f5ec7dad6247f5be4310da73f64fdba6bf7996e88080808080b869f8679e2019eae232f64f5113ef8ecbe971bcdfb7a09ef3ece5d9a9cd4fc8a61030b846f8440180a07d9671f7bd03944a2742cb595ffa39abf195892bc66af6f587e8a9f2b63b750da0d038ec701498b82fc5cd47bda3e06b87aff3df9b6cb82c979c36e615d6cc8fd2",
    length: 3,
};
