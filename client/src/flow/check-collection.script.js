export const CHECK_COLLECTION = `
import NSFT from 0xNSFT

pub fun main(addr: Address): Bool {
    let ref = getAccount(addr).getCapability<&{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath).check()
    return ref
}
`