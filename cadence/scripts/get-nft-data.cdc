import NSFT from "../contracts/NSFT.cdc"

pub fun main(address: Address, tokenID: UInt64): NSFT.NSFData? {
    let account = getAccount(address)

    if let ref = account.getCapability<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath).borrow() {
        let data = ref.getTokenData(id: tokenID)
        return data
    }

    return nil
}