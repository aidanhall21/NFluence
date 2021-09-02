import { emulator, getAccountAddress, init, shallPass } from "flow-js-testing";
import path from "path";
import { addToAuction, deployNSFAuctionContract, setupStorefrontOnAccount, mintNSFT, getAuctionIds, bidOnAuction, getCurrentPriceForAuction, mintUtilityCoin, removeListing, listUserNSFTs, settleAuction, getUtilityCoinVaultBalance, returnBids } from "./src/NSFAuctionContract";

const basePath = path.resolve(__dirname, "../");
const port = 8080;

jest.setTimeout(50000);

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

describe("NSFAuction", () => {
    beforeEach(async () => {
        init(basePath, port)
        return emulator.start(port, false)
    });

    afterEach(async () => {
        return emulator.stop();
    });

    it("deploys NSFAuction contract", async () => {
        await deployNSFAuctionContract();
    });

    it("Should be able to create an empty Storefront", async () => {
        await deployNSFAuctionContract();
        const Alice = await getAccountAddress("Alice")
        await shallPass(setupStorefrontOnAccount(Alice))
    });

    it("Should create an auction", async () => {
        await deployNSFAuctionContract();
        const Alice = await getAccountAddress("Alice")
        await setupStorefrontOnAccount(Alice)
        await mintNSFT(Alice, TEST_NSFT)
        await addToAuction(Alice, 0, "21.0")
        const auctions = await getAuctionIds(Alice)
        expect(auctions.length).toEqual(1)
    });

    it("Should accept a bid", async () => {
        await deployNSFAuctionContract();
        const Alice = await getAccountAddress("Alice")
        const Bob = await getAccountAddress("Bob")
        await setupStorefrontOnAccount(Alice)
        await setupStorefrontOnAccount(Bob)
        await mintUtilityCoin(Bob, "1000.0")
        await mintNSFT(Alice, TEST_NSFT)
        await addToAuction(Alice, 0, "21.0")
        await bidOnAuction(Bob, 0, Alice, "100.0")
        const currentPrice = await getCurrentPriceForAuction(Alice, 0)
        expect(currentPrice).toEqual("100.00000000")
    });

    it("Should cancel the auction and return the nft to the owner if the listing is removed", async () => {
        await deployNSFAuctionContract();
        const Alice = await getAccountAddress("Alice")
        await setupStorefrontOnAccount(Alice)
        await mintNSFT(Alice, TEST_NSFT)
        await addToAuction(Alice, 0, "21.0")
        await removeListing(Alice, 0)
        const nsftlist = await listUserNSFTs(Alice)
        const auctionIds = await getAuctionIds(Alice)
        expect(nsftlist).toEqual(expect.arrayContaining([0]))
        expect(auctionIds).toEqual(expect.not.arrayContaining([0]))
    });

    it("Should send the nft to the highest bidder and the contents of the bid vault minus the cut fee to the previous nft owner when the auction is settled", async () => {
        await deployNSFAuctionContract();
        const Alice = await getAccountAddress("Alice")
        const Bob = await getAccountAddress("Bob")
        await setupStorefrontOnAccount(Alice)
        await setupStorefrontOnAccount(Bob)
        await mintUtilityCoin(Bob, "1000.0")
        await mintNSFT(Alice, TEST_NSFT)
        await addToAuction(Alice, 0, "21.0")
        await bidOnAuction(Bob, 0, Alice, "100.0")
        await settleAuction(Alice, 0)
        const nsftlist = await listUserNSFTs(Bob)
        const balance = await getUtilityCoinVaultBalance(Alice)
        expect(nsftlist).toEqual(expect.arrayContaining([0]))
        expect(balance).toEqual("80.00000000")
    })

    it("Should return a list of all bids on the current auction", async () => {
        await deployNSFAuctionContract();
        const Alice = await getAccountAddress("Alice")
        const Bob = await getAccountAddress("Bob")
        await setupStorefrontOnAccount(Alice)
        await setupStorefrontOnAccount(Bob)
        await mintUtilityCoin(Bob, "1000.0")
        await mintNSFT(Alice, TEST_NSFT)
        await addToAuction(Alice, 0, "21.0")
        await bidOnAuction(Bob, 0, Alice, "100.0")
        const bids = await returnBids(Alice, 0)
        expect(bids.length).toEqual(1)
    })
})