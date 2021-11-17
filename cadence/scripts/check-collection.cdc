import NFluence from "../contracts/NFluence.cdc"

pub fun main(addr: Address): Bool {
    let ref = getAccount(addr).getCapability<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath).check()
    return ref
}
