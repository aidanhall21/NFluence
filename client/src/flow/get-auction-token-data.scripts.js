export const GET_AUCTION_TOKEN_DATA = `
import NSFAuction from 0xNSFAUCTION
import NSFT from 0xNSFT

pub fun main(address: Address, tokenID: UInt64): NSFT.NSFData? {

    if let storefront = getAccount(address).getCapability<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(NSFAuction.StorefrontPublicPath).borrow() {
        let data = storefront.borrowListing(listingResourceID: tokenID)!
        return data.getNFTData()!
    }

    return nil

}
`