import NFluenceAuction from "../contracts/NFluenceAuction.cdc"
import NFluence from "../contracts/NFluence.cdc"
import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

transaction(listingResourceID: UInt64) {
    let storefront: &NFluenceAuction.Storefront
    let vaultCap: Capability<&{FungibleToken.Receiver}>
    let collectionCap: Capability<&{NFluence.NFluenceCollectionPublic}>

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NFluenceAuction.Storefront>(from: NFluenceAuction.NFluenceAuctionStorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront.Storefront")
        let vaultRef = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault)
            ?? panic("Could not borrow reference to the owner's Vault!")
        self.vaultCap = acct.getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)
        self.collectionCap = acct.getCapability<&{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath)
    }

    execute {
        self.storefront.settleListing(listingResourceID: listingResourceID)
    }
}