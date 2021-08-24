import NSFAuction from "../contracts/NSFAuction.cdc"
import UtilityCoin from "../contracts/UtilityCoin.cdc"

transaction() {

    prepare(signer: AuthAccount) {
        let cutVaultRef = signer.borrow<&NSFAuction.Administrator>(from: /storage/NSFAuctionAdmin)
                        ?? panic("Could not borrow Balance reference to the Vault")
        let vaultRef = signer.borrow<&UtilityCoin.Vault>(from: /storage/utilityCoinVault)
                        ?? panic("Could not borrow reference to the owner's Vault!")
        let deposit <- cutVaultRef.retrieveCutVault()
        vaultRef.deposit(from: <- deposit)
    }
}