export const INIT_ACCOUNT = `
import NFluence from 0xNFLUENCE
import NFluenceAuction from 0xAUCTION

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
`