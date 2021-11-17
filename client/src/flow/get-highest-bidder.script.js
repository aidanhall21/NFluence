export const GET_HIGHEST_BIDDER = `
import NFluenceAuction from 0xAUCTION

pub fun main(address: Address, tokenID: UInt64): Address? {

    if let storefront = getAccount(address).getCapability<&NFluenceAuction.Storefront{NFluenceAuction.StorefrontPublic}>(NFluenceAuction.NFluenceAuctionStorefrontPublicPath).borrow() {
        let data = storefront.borrowListing(listingResourceID: tokenID)!
        return data.currentHighestBidder()
    }

    return nil

}
`