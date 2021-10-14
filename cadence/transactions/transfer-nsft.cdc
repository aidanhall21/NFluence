import NFluence from "../contracts/NFluence.cdc"
import NFluenceAuction from "../contracts/NFluenceAuction.cdc"

transaction(recipient: Address, withdrawID: UInt64) {
    prepare(signer: AuthAccount) {
        
        let recipient = getAccount(recipient)
        let collectionRef = signer.borrow<&NFluence.Collection>(from: NFluence.CollectionStoragePath)
            ?? panic("Could not borrow a reference to the owner's collection")
        let storefront = signer.borrow<&NFluenceAuction.Storefront{NFluenceAuction.StorefrontManager}>(from: NFluenceAuction.NFluenceAuctionStorefrontStoragePath)
            ?? panic("Missing or mis-typed NFTStorefront.Storefront")
        let depositRef = recipient.getCapability(NFluence.CollectionPublicPath).borrow<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>()!
        storefront.removeListing(listingResourceID: withdrawID)
        let nft <- collectionRef.withdraw(withdrawID: withdrawID)
        depositRef.deposit(token: <-nft)
    }
}