import NSFT from "../contracts/NSFT.cdc"

// This script returns the size of an account's KittyItems collection.

pub fun main(address: Address): Int {
    let account = getAccount(address)

    let collectionRef = account.getCapability(NSFT.CollectionPublicPath)
        .borrow<&NSFT.Collection{NSFT.NSFTCollectionPublic}>()
        ?? panic("Could not borrow capability from public collection")
    
    return collectionRef.getIDs().length
}