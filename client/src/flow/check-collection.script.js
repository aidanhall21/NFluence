export const CHECK_COLLECTION = `
import NFluence from 0xNFLUENCE

pub fun main(addr: Address): Bool {
    let ref = getAccount(addr).getCapability<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath).check()
    return ref
}
`