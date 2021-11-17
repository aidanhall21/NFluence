export const GET_SINGLE_AUCTION_DATA = `
import NFluenceAuction from 0xAUCTION

pub fun main(address: Address, tokenID: UInt64): NFluenceAuction.AuctionData? {

    if let storefront = getAccount(address).getCapability<&NFluenceAuction.Storefront{NFluenceAuction.StorefrontPublic}>(NFluenceAuction.NFluenceAuctionStorefrontPublicPath).borrow() {
        let data = storefront.borrowListing(listingResourceID: tokenID)!
        return data.getAuctionData()
    }

    return nil

}
`