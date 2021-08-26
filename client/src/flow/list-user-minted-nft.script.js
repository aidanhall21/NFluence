export const LIST_USER_OWNED_NFTS = `
import NSFT from 0xNSFT

pub fun main(addr: Address): [UInt64]? {
    let account = getAccount(addr)

    if let ref = account.getCapability<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath).borrow() {
        let data = ref.getIDs()
        return data
    }

    return nil
}
`
