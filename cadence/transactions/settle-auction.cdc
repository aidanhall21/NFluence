import NFluenceAuction from "../contracts/NFluenceAuction.cdc"

transaction(listingResourceID: UInt64) {
    let storefront: &NFluenceAuction.Storefront{NFluenceAuction.StorefrontManager}

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NFluenceAuction.Storefront{NFluenceAuction.StorefrontManager}>(from: NFluenceAuction.NFluenceAuctionStorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront.Storefront")
    }

    execute {
        self.storefront.settleListing(listingResourceID: listingResourceID)
    }
}