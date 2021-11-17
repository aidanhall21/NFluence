export const GET_TOKEN_DATA = `
import NFluence from 0xNFLUENCE

pub fun main(addr: Address): [NFluence.NFluenceNFTData] {
    let account = getAccount(addr)

    let ref = account.getCapability<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath).borrow()
                    ?? panic("Oh NO!")
    let data = ref.getAllTokenData()
    return data
}
`