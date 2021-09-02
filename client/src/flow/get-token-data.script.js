export const GET_TOKEN_DATA = `
import NSFT from 0xNSFT

pub fun main(addr: Address): [NSFT.NSFData]? {
    let account = getAccount(addr)

    if let ref = account.getCapability<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath).borrow() {
        let data = ref.getAllTokenData()
        return data
    }

    return nil

}
`