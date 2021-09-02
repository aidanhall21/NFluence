import { deployContractByName, executeScript, getAccountAddress, mintFlow, sendTransaction } from "flow-js-testing";

export const getNSFTAdminAddress = async () => getAccountAddress("NSFTAdmin")

export const deployNSFTContract = async () => {
    const NSFTAdmin = await getAccountAddress("NSFTAdmin")
    await mintFlow(NSFTAdmin, "10.0")
    await deployContractByName({ to: NSFTAdmin, name: "NonFungibleToken" })
    const addressMap = { FungibleToken: "0xee82856bf20e2aa6", NonFungibleToken: NSFTAdmin, NSFAuction: NSFTAdmin }
    await deployContractByName({ to: NSFTAdmin, name: "NSFT", addressMap })
}

export const deployNSFAuctionContract = async () => {
    const NSFTAdmin = await getAccountAddress("NSFTAdmin")
    await mintFlow(NSFTAdmin, "10.0")
    await deployNSFTContract()
    await deployContractByName({ to: NSFTAdmin, name: "UtilityCoin" })
    const addressMap = { FungibleToken: "0xee82856bf20e2aa6", NonFungibleToken: NSFTAdmin, NSFT: NSFTAdmin, UtilityCoin: NSFTAdmin }
    await deployContractByName({ to: NSFTAdmin, name: "NSFAuction", addressMap })
}

export const setupStorefrontOnAccount = async (account) => {
    const name = 'init-account';
    const signers = [account]
    return sendTransaction({ name, signers })
}

export const checkCollection = async (account) => {
    const name ='check-collection'
    const args = [account]
    const res = await executeScript({ name, args })
    return res
}

export const returnBids = async (account, nftId) => {
    const name = 'get-bid-history'
    const args = [account, nftId]
    const res = await executeScript({ name, args })
    return res
}

export const checkStorefront = async (account) => {
    const name ='check-storefront'
    const args = [account]
    const res = await executeScript({ name, args })
    return res
}

export const checkUtilityCoinVault = async (account) => {
    const name = 'check-utility-coin-vault'
    const args = [account]
    const res = await executeScript({ name, args })
    return res
}

export const mintNSFT = async (account, nsft) => {
    const name = 'mint-nsft';
    const signers = [account];
    const args = [account, nsft.cid, nsft.fileType, nsft.title, nsft.description, nsft.editionSize]
    await sendTransaction({ name, args, signers })
}

export const mintUtilityCoin = async (recipient, amount) => {
    const NSFTAdmin = await getNSFTAdminAddress();
    const name = 'mint-utility-coin'
    const signers = [NSFTAdmin]
    const args = [recipient, amount]
    await sendTransaction({ name, args, signers })
}

export const getUtilityCoinVaultBalance = async (account) => {
    const name = 'get-utility-coin-balance'
    const args = [account]
    const res = await executeScript({ name, args })
    return res
}

export const addToAuction = async (account, nftId, startPrice) => {
    const name = "create-auction";
    const signers = [account];
    const args = [nftId, startPrice]
    await sendTransaction({ name, args, signers })
}

export const getAuctionIds = async (account) => {
    const name = "get-auction-ids"
    const args = [account]
    const res = await executeScript({ name, args })
    return res
}

export const bidOnAuction = async (account, auctionID, nftOwner, bidPrice) => {
    const name = "bid-on-auction"
    const args = [auctionID, nftOwner, bidPrice]
    const signers = [account]
    await sendTransaction({ name, args, signers })
}

export const getCurrentPriceForAuction = async (account, listingID) => {
    const name = "get-current-price-for-auction"
    const args = [account, listingID]
    const res = await executeScript({ name, args })
    return res
}

export const removeListing = async (account, listingID) => {
    const name = "remove-listing"
    const args = [listingID]
    const signers = [account]
    await sendTransaction({ name, args, signers })
}

export const listUserNSFTs = async (account) => {
    const name = "get-user-nsft-ids"
    const args = [account]
    const nsfts = await executeScript({ name, args })
    return nsfts
}

export const settleAuction = async (account, listingID ) => {
    const name = "settle-auction"
    const args = [listingID]
    const signers = [account]
    await sendTransaction({ name, args, signers })
}