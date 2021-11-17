export const GET_SINGLE_TOKEN_DATA = `
import NFluence from 0xNFLUENCE

pub fun main(addr: Address, tokenID: UInt64): NFluence.NFluenceNFTData? {
    let account = getAccount(addr)

    if let ref = account.getCapability<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath).borrow() {
        let data = ref.getTokenData(id: tokenID)
        return data
    }

    return nil
}
`