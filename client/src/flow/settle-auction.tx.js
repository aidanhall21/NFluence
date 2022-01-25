export const SETTLE_AUCTION = `
import NFluence from 0xNFLUENCE
import NFluenceAuction from 0xAUCTION
import FungibleToken from 0xFUNG
import FUSD from 0xFUSD

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
`