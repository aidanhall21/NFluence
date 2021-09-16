import NSFT from "../contracts/NSFT.cdc"
import NSFAuction from "../contracts/NSFAuction.cdc"
import UtilityCoin from "../contracts/UtilityCoin.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"

transaction {
  prepare(acct: AuthAccount) {
    acct.unlink(NSFT.CollectionPublicPath)
    let collection <- NSFT.createEmptyCollection()
    acct.save(<- collection, to: /storage/testStorage)
    acct.link<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath, target: /storage/testStorage)

    /* 
    acct.unlink(NSFAuction.StorefrontPublicPath)
    let storefront <- NSFAuction.createStorefront()
    acct.save(<-storefront, to: NSFAuction.StorefrontStoragePath)
    acct.link<&NSFAuction.Storefront{NSFAuction.StorefrontPublic}>(NSFAuction.StorefrontPublicPath, target: NSFAuction.StorefrontStoragePath)

    acct.unlink(/public/utilityCoinReceiver)
    acct.unlink(/public/utilityCoinBalance)
    acct.save(<- UtilityCoin.createEmptyVault(), to: /storage/utilityCoinVault)
    acct.link<&UtilityCoin.Vault{FungibleToken.Receiver}>(/public/utilityCoinReceiver, target: /storage/utilityCoinVault)
    acct.link<&UtilityCoin.Vault{FungibleToken.Balance}>(/public/utilityCoinBalance, target: /storage/utilityCoinVault)
    */
  }
}