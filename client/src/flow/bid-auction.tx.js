export const BID_ON_AUCTION = `
import NSFT from 0xNSFT
import NSFAuction from 0xNSFAUCTION
import FungibleToken from 0x9a0766d93b6608b7
import UtilityCoin from 0xUTILITYCOIN

transaction(listingResourceID: UInt64, storefrontAddress: Address, bidAmount: UFix64) {
    let paymentVault: @FungibleToken.Vault
    let storefront: &NSFAuction.Storefront{NSFAuction.StorefrontPublic}
    let listing: &NSFAuction.AuctionItem{NSFAuction.AuctionPublic}
    let vaultCap: Capability<&{FungibleToken.Receiver}>
    let collectionCap: Capability<&{NSFT.NSFTCollectionPublic}>

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(
                NSFAuction.StorefrontPublicPath
            )
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")
        self.listing = self.storefront.borrowListing(listingResourceID: listingResourceID)
            ?? panic("No offer with that ID in Storefront")
        let vaultRef = acct.borrow<&UtilityCoin.Vault>(from: /storage/utilityCoinVault)
            ?? panic("Could not borrow reference to the owner's Vault!")
        self.paymentVault <- vaultRef.withdraw(amount: bidAmount)
        self.vaultCap = acct.getCapability<&{FungibleToken.Receiver}>(/public/utilityCoinReceiver)
        self.collectionCap = acct.getCapability<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath)
    }

    execute {
        self.listing.placeBid(bidTokens: <-self.paymentVault, vaultCap: self.vaultCap, collectionCap: self.collectionCap)
    }
}
`