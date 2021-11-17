import NFluenceAuction from "../contracts/NFluenceAuction.cdc"

pub fun main(address: Address): [UInt64] {

    if let storefront = getAccount(address).getCapability<&NFluenceAuction.Storefront{NFluenceAuction.StorefrontPublic}>(NFluenceAuction.NFluenceAuctionStorefrontPublicPath).borrow() {
        let auctionIds = storefront.getListingIDs()
        return auctionIds
    }

    return []

}