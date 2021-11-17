import NFluenceAuction from "../contracts/NFluenceAuction.cdc"
import NFluence from "../contracts/NFluence.cdc"
import FungibleToken from 0x9a0766d93b6608b7

transaction(nftId: UInt64, startPrice: UFix64) {
    let ownerCollectionCap: Capability<&NFluence.Collection>
    let ownerVaultCap: Capability<&{FungibleToken.Receiver}>
    let storefront: &NFluenceAuction.Storefront
    let accountCollectionRef: &NFluence.Collection

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&NFluenceAuction.Storefront>(from: NFluenceAuction.NFluenceAuctionStorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront Storefront")
        self.accountCollectionRef = acct.borrow<&NFluence.Collection>(from: NFluence.CollectionStoragePath)
            ?? panic("Cannot borrow reference to collection")
        self.ownerCollectionCap = acct.getCapability<&NFluence.Collection>(NFluence.CollectionPublicPath)
        self.ownerVaultCap = acct.getCapability<&{FungibleToken.Receiver}>(/public/fusdReceiver)
    }

    execute {
        let currentTime = getCurrentBlock().timestamp
        let minimumBidIncrement = (1 as Int32)
        let auctionLength = 604800.0

        //let nft <- self.accountCollectionRef.withdraw(withdrawID: nftId)
        self.storefront.createAuction(token: nftId, minimumBidIncrement: minimumBidIncrement, auctionLength: auctionLength, auctionStartTime: currentTime, startPrice: startPrice, collectionCap: self.ownerCollectionCap, vaultCap: self.ownerVaultCap)
    }
}