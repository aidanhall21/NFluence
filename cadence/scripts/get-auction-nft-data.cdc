import NSFAuction from "../contracts/NSFAuction.cdc"
import NSFT from "../contracts/NSFT.cdc"

pub fun main(address: Address, tokenID: UInt64): NSFT.NSFData? {

    if let storefront = getAccount(address).getCapability<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(NSFAuction.StorefrontPublicPath).borrow() {
        let data = storefront.borrowListing(listingResourceID: tokenID)!
        return data.getNFTData()!
    }

    return nil

}