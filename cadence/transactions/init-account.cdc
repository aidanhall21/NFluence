import NFluence from "../contracts/NFluence.cdc"
import NFluenceAuction from "../contracts/NFluenceAuction.cdc"
import NFluenceUtilityCoin from "../contracts/NFluenceUtilityCoin.cdc"
import FungibleToken from 0x9a0766d93b6608b7

transaction {
  prepare(acct: AuthAccount) {
    let collection <- NFluence.createEmptyCollection()
    acct.save(<- collection, to: NFluence.CollectionStoragePath)
    acct.link<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath, target: NFluence.CollectionStoragePath)

    let storefront <- NFluenceAuction.createStorefront()
    acct.save(<-storefront, to: NFluenceAuction.NFluenceAuctionStorefrontStoragePath)
    acct.link<&NFluenceAuction.Storefront{NFluenceAuction.StorefrontPublic}>(NFluenceAuction.NFluenceAuctionStorefrontPublicPath, target: NFluenceAuction.NFluenceAuctionStorefrontStoragePath)

    acct.save(<- NFluenceUtilityCoin.createEmptyVault(), to: NFluenceUtilityCoin.NFluenceUtilityCoinVaultStoragePath)
    acct.link<&NFluenceUtilityCoin.Vault{FungibleToken.Receiver}>(NFluenceUtilityCoin.NFluenceUtilityCoinReceiverPublicPath, target: NFluenceUtilityCoin.NFluenceUtilityCoinVaultStoragePath)
    acct.link<&NFluenceUtilityCoin.Vault{FungibleToken.Balance}>(NFluenceUtilityCoin.NFluenceUtilityCoinBalancePublicPath, target: NFluenceUtilityCoin.NFluenceUtilityCoinVaultStoragePath)
  }
}