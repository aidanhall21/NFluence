import NSFT from "../contracts/NSFT.cdc"

pub fun main(addr: Address): [NSFT.NSFData] {
    let account = getAccount(addr)

    let ref = account.getCapability<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath).borrow()
                    ?? panic("Oh NO!")
    let data = ref.getAllTokenData()
    return data
}