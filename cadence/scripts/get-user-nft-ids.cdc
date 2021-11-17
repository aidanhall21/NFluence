import NFluence from "../contracts/NFluence.cdc"

pub fun main(addr: Address): [UInt64]? {
    let account = getAccount(addr)

    if let ref = account.getCapability<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath).borrow() {
        let data = ref.getIDs()
        return data
    }

    return nil
}