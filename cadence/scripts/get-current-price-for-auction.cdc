import NSFAuction from "../contracts/NSFAuction.cdc"

pub fun main(address: Address, listingID: UInt64): UFix64 {

    let storefront = getAccount(address).getCapability<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(NSFAuction.StorefrontPublicPath).borrow()
                        ?? panic("Cannot borrow reference to the storefront")
    let auction = storefront.borrowListing(listingResourceID: listingID)!
    let data = auction.getAuctionData()
    return data.price
}