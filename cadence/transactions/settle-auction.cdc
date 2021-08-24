import NSFT from "../contracts/NSFT.cdc"
import NSFAuction from "../contracts/NSFAuction.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"
import UtilityCoin from "../contracts/UtilityCoin.cdc"

transaction(listingResourceID: UInt64) {
    let storefront: &NSFAuction.Storefront{NSFAuction.StorefrontManager}
    let vaultCap: Capability<&{FungibleToken.Receiver}>
    let collectionCap: Capability<&{NSFT.NSFTCollectionPublic}>

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NSFAuction.Storefront{NSFAuction.StorefrontManager}>(from: NSFAuction.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront.Storefront")
        let vaultRef = acct.borrow<&UtilityCoin.Vault>(from: /storage/utilityCoinVault)
            ?? panic("Could not borrow reference to the owner's Vault!")
        self.vaultCap = acct.getCapability<&{FungibleToken.Receiver}>(/public/utilityCoinReceiver)
        self.collectionCap = acct.getCapability<&{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath)
    }

    execute {
        self.storefront.settleListing(listingResourceID: listingResourceID)
    }
}