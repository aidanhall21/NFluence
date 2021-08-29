export const GET_BID_HISTORY = `
import NSFAuction from 0xNSFAUCTION
import NSFT from 0xNSFT

pub fun main(address: Address, tokenID: UInt64): [NSFAuction.Bid]? {

    if let storefront = getAccount(address).getCapability<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(NSFAuction.StorefrontPublicPath).borrow() {
        let data = storefront.borrowListing(listingResourceID: tokenID)!
        return data.getBidHistory()
    }

    return nil

}
`