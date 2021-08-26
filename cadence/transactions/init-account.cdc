import NSFT from "../contracts/NSFT.cdc"
import NSFAuction from "../contracts/NSFAuction.cdc"
import UtilityCoin from "../contracts/UtilityCoin.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"

transaction {
  prepare(acct: AuthAccount) {
    if acct.borrow<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(from: NSFT.CollectionStoragePath) == nil {
      let collection <- NSFT.createEmptyCollection()
      acct.save(<- collection, to: NSFT.CollectionStoragePath)
      acct.link<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath, target: NSFT.CollectionStoragePath)
    }

    if acct.borrow<&NSFAuction.Storefront>(from: NSFAuction.StorefrontStoragePath) == nil {
      let storefront <- NSFAuction.createStorefront()
      acct.save(<-storefront, to: NSFAuction.StorefrontStoragePath)
      acct.link<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(NSFAuction.StorefrontPublicPath, target: NSFAuction.StorefrontStoragePath)
    }

    if acct.borrow<&UtilityCoin.Vault>(from: /storage/utilityCoinVault) == nil {
      acct.save(<- UtilityCoin.createEmptyVault(), to: /storage/utilityCoinVault)
      acct.link<&UtilityCoin.Vault{FungibleToken.Receiver}>(/public/utilityCoinReceiver, target: /storage/utilityCoinVault)
      acct.link<&UtilityCoin.Vault{FungibleToken.Balance}>(/public/utilityCoinBalance, target: /storage/utilityCoinVault)
    }
  }
}