import NFluenceAuction from "../contracts/NFluenceAuction.cdc"

pub fun main(address: Address, tokenID: UInt64): Address? {

    if let storefront = getAccount(address).getCapability<&NFluenceAuction.Storefront{NFluenceAuction.StorefrontPublic}>(NFluenceAuction.NFluenceAuctionStorefrontPublicPath).borrow() {
        let data = storefront.borrowListing(listingResourceID: tokenID)!
        return data.currentHighestBidder()
    }

    return nil

}