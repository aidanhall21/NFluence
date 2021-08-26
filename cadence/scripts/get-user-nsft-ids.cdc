import NSFT from "../contracts/NSFT.cdc"

pub fun main(addr: Address): [UInt64]? {
    let account = getAccount(addr)

    if let ref = account.getCapability<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath).borrow() {
        let data = ref.getIDs()
        return data
    }

    return nil
}