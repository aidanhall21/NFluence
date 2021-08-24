import NSFAuction from "../contracts/NSFAuction.cdc"

pub fun main(addr: Address): Bool {
    let ref = getAccount(addr).getCapability<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(NSFAuction.StorefrontPublicPath).check()
    return ref
}