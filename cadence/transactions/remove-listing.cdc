import NFluenceAuction from "../contracts/NFluenceAuction.cdc"
import NFluence from "../contracts/NFluence.cdc"
import FungibleToken from 0x9a0766d93b6608b7

transaction(listingId: UInt64) {
    let storefront: &NFluenceAuction.Storefront

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NFluenceAuction.Storefront>(from: NFluenceAuction.NFluenceAuctionStorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingId)
    }
}