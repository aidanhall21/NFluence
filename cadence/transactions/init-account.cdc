import NFluence from "../contracts/NFluence.cdc"
import NFluenceAuction from "../contracts/NFluenceAuction.cdc"

transaction {
  prepare(acct: AuthAccount) {
    let collection <- NFluence.createEmptyCollection()
    acct.save(<- collection, to: NFluence.CollectionStoragePath)
    acct.link<&NFluence.Collection>(NFluence.CollectionPublicPath, target: NFluence.CollectionStoragePath)

    let storefront <- NFluenceAuction.createStorefront()
    acct.save(<-storefront, to: NFluenceAuction.NFluenceAuctionStorefrontStoragePath)
    acct.link<&NFluenceAuction.Storefront{NFluenceAuction.StorefrontPublic}>(NFluenceAuction.NFluenceAuctionStorefrontPublicPath, target: NFluenceAuction.NFluenceAuctionStorefrontStoragePath)

  }
}