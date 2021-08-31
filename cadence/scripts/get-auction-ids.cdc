import NSFAuction from "../contracts/NSFAuction.cdc"

pub fun main(address: Address): [UInt64]? {

    if let storefront = getAccount(address).getCapability<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(NSFAuction.StorefrontPublicPath).borrow() {
        let auctionIds = storefront.getListingIDs()
        return auctionIds
    }

    return nil
}