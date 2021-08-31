export const GET_AUCTION_IDS = `
import NSFAuction from 0xNSFAUCTION

pub fun main(address: Address): [UInt64] {

    if let storefront = getAccount(address).getCapability<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(NSFAuction.StorefrontPublicPath).borrow() {
        let auctionIds = storefront.getListingIDs()
        return auctionIds
    }

    return []

}
`