import path from "path";
import { emulator, executeScript, getAccountAddress, init, shallPass, shallResolve, shallRevert } from "flow-js-testing";
import { deployNSFAuctionContract, deployNSFTContract, getNSFTcount, getNSFTData, listUserNSFTs, mintMultipleNSFTs, mintNSFT, setupNSFTAccount, transferNSFT } from "./src/NSFTContract";

const basePath = path.resolve(__dirname, "../");
const port = 8080;

const TEST_NSFT = {
    nftId: 0,
    nftEditionId: 0,
    cid: "0x0",
    fileType: 0,
    title: "test nsft",
    description: "test nsft",
    creatorAddress: "0xf8d6e0586b0a20c7",
    serial: 1,
    editionSize: 1
  }

jest.setTimeout(50000);

describe("NSFT", () => {
    beforeEach(async () => {
        init(basePath, port)
        return emulator.start(port, false)
    });

    afterEach(async () => {
        return emulator.stop();
    });

    it("deploys NSFT contract", async () => {
        await deployNSFTContract();
    });

    it("totalSupply should be 0 after contract is deployed", async () => {
        await deployNSFTContract();
        const res = await executeScript({ name: "get-total-supply" })
        expect(res).toBe(0)
    });

    it("Should mint a single NSFT", async () => {
        await deployNSFTContract()
        await deployNSFAuctionContract()
        const Alice = await getAccountAddress("Alice")
        await setupNSFTAccount(Alice);
        await mintNSFT(Alice, TEST_NSFT)
        const userNSFTs = await listUserNSFTs(Alice)
        expect(userNSFTs.length).toBe(1)
    });

    it("Should mint multiple NSFTs when editionSize parameter is greater than 1", async () => {
        await deployNSFTContract()
        await deployNSFAuctionContract()
        const Alice = await getAccountAddress("Alice")
        await setupNSFTAccount(Alice);
        await mintMultipleNSFTs(Alice, TEST_NSFT, 3)
        const userNSFTs = await listUserNSFTs(Alice)
        expect(userNSFTs.length).toBe(3)
    });

    it("Should not mint any NSFTs if editionSize parameter is greater then the maxEditionSize constraint", async () => {
        await deployNSFTContract()
        await deployNSFAuctionContract()
        const Alice = await getAccountAddress("Alice")
        await setupNSFTAccount(Alice);
        await shallRevert(mintMultipleNSFTs(Alice, TEST_NSFT, 13))
    })

    it("Should be able to create a new empty NFT Collection", async () => {
        await deployNSFTContract()
        await deployNSFAuctionContract()
        const Alice = await getAccountAddress("Alice")
        await setupNSFTAccount(Alice)
        await shallResolve(async () => {
            const nsftcount = await getNSFTcount(Alice);
            expect(nsftcount).toBe(0)
        })
    });

    it("Should not be able to to withdraw an NSFT that doesn't exist in a collection", async () => {
        await deployNSFTContract()
        await deployNSFAuctionContract()
        const Alice = await getAccountAddress("Alice")
        const Bob = await getAccountAddress("Bob")
        await setupNSFTAccount(Alice)
        await setupNSFTAccount(Bob)
        await shallRevert(transferNSFT(Alice, Bob, 21))
    })

    it("Should be able to withdraw an NSFT and deposit to another accounts collection", async () => {
        await deployNSFTContract()
        await deployNSFAuctionContract()
        const Alice = await getAccountAddress("Alice")
        const Bob = await getAccountAddress("Bob")
        await setupNSFTAccount(Alice)
        await setupNSFTAccount(Bob)
        await mintNSFT(Alice, TEST_NSFT)
        await shallPass(transferNSFT(Alice, Bob, 0))
    });

    it("Should not return data for an NSFT that doesn't exist", async () => {
        await deployNSFTContract()
        await deployNSFAuctionContract()
        const Alice = await getAccountAddress("Alice")
        await setupNSFTAccount(Alice);
        await mintNSFT(Alice, TEST_NSFT)
        await shallRevert(getNSFTData(Alice, 21))
    });
});

