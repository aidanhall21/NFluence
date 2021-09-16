export const CREATE_AUCTION = `
import NSFAuction from 0xNSFAUCTION
import NSFT from 0xNSFT
import FungibleToken from 0x9a0766d93b6608b7

transaction(nftId: UInt64, startPrice: UFix64) {
    let ownerCollectionCap: Capability<&{NSFT.NSFTCollectionPublic}>
    let ownerVaultCap: Capability<&{FungibleToken.Receiver}>
    let storefront: &NSFAuction.Storefront
    let accountCollectionRef: &NSFT.Collection

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NSFAuction.Storefront>(from: NSFAuction.StorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
        self.accountCollectionRef = acct.borrow<&NSFT.Collection>(from: /storage/NFTCollection)
            ?? panic("Cannot borrow reference to collection")
        self.ownerCollectionCap = acct.getCapability<&{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath)
        self.ownerVaultCap = acct.getCapability<&{FungibleToken.Receiver}>(/public/utilityCoinReceiver)
    }

    execute {
        let currentTime = getCurrentBlock().timestamp
        let minimumBidIncrement = (1 as Int32)
        let auctionLength = 604800.0

        let nft <- self.accountCollectionRef.withdraw(withdrawID: nftId)
        self.storefront.createAuction(token: <-nft, minimumBidIncrement: minimumBidIncrement, auctionLength: auctionLength, auctionStartTime: currentTime, startPrice: startPrice, collectionCap: self.ownerCollectionCap, vaultCap: self.ownerVaultCap)
    }
}
`