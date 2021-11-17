import NFluence from "../contracts/NFluence.cdc"

pub fun main(addr: Address): [NFluence.NFluenceNFTData] {
    let account = getAccount(addr)
    if let ref = account.getCapability<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath).borrow() {
        let data = ref.getAllTokenData()
        return data
    }
    
    return []
}