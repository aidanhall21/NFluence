import NFluenceAuction from "../contracts/NFluenceAuction.cdc"
import NFluenceUtilityCoin from "../contracts/NFluenceUtilityCoin.cdc"

transaction() {

    prepare(signer: AuthAccount) {
        let cutVaultRef = signer.borrow<&NFluenceAuction.Administrator>(from: NFluenceAuction.NFluenceAuctionAdminStorage)
                        ?? panic("Could not borrow Balance reference to the Vault")
        let vaultRef = signer.borrow<&NFluenceUtilityCoin.Vault>(from: NFluenceUtilityCoin.NFluenceUtilityCoinVaultStoragePath)
                        ?? panic("Could not borrow reference to the owner's Vault!")
        let deposit <- cutVaultRef.retrieveCutVault()
        vaultRef.deposit(from: <- deposit)
    }
}