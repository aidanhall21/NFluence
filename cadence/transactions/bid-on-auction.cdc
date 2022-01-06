import NFluence from "../contracts/NFluence.cdc"
import NFluenceAuction from "../contracts/NFluenceAuction.cdc"
import FungibleToken from 0x9a0766d93b6608b7
import FUSD from 0xe223d8a629e49c68

transaction(listingResourceID: UInt64, storefrontAddress: Address, bidAmount: UFix64) {
    let paymentVault: @FungibleToken.Vault
    let storefront: &NFluenceAuction.Storefront{NFluenceAuction.StorefrontPublic}
    let listing: &NFluenceAuction.AuctionItem{NFluenceAuction.AuctionPublic}
    let vaultCap: Capability<&{FungibleToken.Receiver}>
    let collectionCap: Capability<&{NFluence.NFluenceCollectionPublic}>

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NFluenceAuction.Storefront{NFluenceAuction.StorefrontPublic}>(
                NFluenceAuction.NFluenceAuctionStorefrontPublicPath
            )
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")
        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No offer with that ID in Storefront")
        let vaultRef = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault)
            ?? panic("Could not borrow reference to the owner's Vault!")
        self.paymentVault <- vaultRef.withdraw(amount: bidAmount)
        self.vaultCap = acct.getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)
        self.collectionCap = acct.getCapability<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath)
    }

    execute {
        self.listing.placeBid(bidTokens: <-self.paymentVault, vaultCap: self.vaultCap, collectionCap: self.collectionCap)
    }
}