import NSFAuction from "../contracts/NSFAuction.cdc"
import NSFT from "../contracts/NSFT.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"

transaction(listingId: UInt64) {
    let storefront: &NSFAuction.Storefront

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NSFAuction.Storefront>(from: NSFAuction.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingId)
    }
}