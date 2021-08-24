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
    //await deployContractByName({ to: NSFTAdmin, name: "NonFungibleToken", update: true })
    //await deployContractByName({ to: NSFTAdmin, name: "NSFT", update: true })
    await deployContractByName({ to: NSFTAdmin, name: "UtilityCoin" })
    const addressMap = { FungibleToken: "0xee82856bf20e2aa6", NonFungibleToken: NSFTAdmin, NSFT: NSFTAdmin, UtilityCoin: NSFTAdmin }
    await deployContractByName({ to: NSFTAdmin, name: "NSFAuction", addressMap })
}

export const setupNSFTAccount = async (account) => {
    const name = 'init-account';
    const signers = [account]
    await sendTransaction({ name, signers })
}

export const mintNSFT = async (account, nsft) => {
    const name = 'mint-nsft';
    const signers = [account];
    const args = [account, nsft.cid, nsft.fileType, nsft.title, nsft.description, nsft.editionSize]
    await sendTransaction({ name, args, signers })
}

export const mintMultipleNSFTs = async (account, nsft, editionSize) => {
    const name = 'mint-nsft';
    const signers = [account];
    const args = [account, nsft.cid, nsft.fileType, nsft.title, nsft.description, editionSize]
    await sendTransaction({ name, args, signers })
}

export const listUserNSFTs = async (account) => {
    const name = "get-user-nsft-ids"
    const args = [account]
    const nsfts = await executeScript({ name, args })
    return nsfts
}

export const getNSFTcount = async (account) => {
    const name = "get-collection-length"
    const args = [account]
    return executeScript({ name, args })
}

export const transferNSFT = async (sender, recipient, itemID) => {
    const name = "transfer-nsft"
    const args = [recipient, itemID]
    const signers = [sender];
    return sendTransaction({ name, args, signers })
}

export const getNSFTData = async (account, itemID) => {
    const name = "get-nft-data"
    const args = [account, itemID]
    return executeScript({ name, args })
}