export const INIT_ACCOUNT = `
import NSFT from 0xNSFT
import NSFAuction from 0xNSFAUCTION
import UtilityCoin from 0xUTILITYCOIN
import FungibleToken from 0x9a0766d93b6608b7

transaction {
  prepare(acct: AuthAccount) {
    if acct.borrow<&NSFT.Collection>(from: NSFT.CollectionStoragePath) == nil {
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
`