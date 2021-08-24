import NSFT from "../contracts/NSFT.cdc"

pub fun main(addr: Address): [NSFT.NSFData]? {
    let account = getAccount(addr)

    if let ref = account.getCapability<&{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath).borrow() {
        let data = ref.getAllTokenData()
        return data
    }

    return nil
}