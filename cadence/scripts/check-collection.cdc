import NSFT from "../contracts/NSFT.cdc"

pub fun main(addr: Address): Bool {
    let ref = getAccount(addr).getCapability<&{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath).check()
    return ref
}
