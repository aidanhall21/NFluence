import FungibleToken from 0x9a0766d93b6608b7
import NFluenceUtilityCoin from "../contracts/NFluenceUtilityCoin.cdc"

transaction {
    prepare(signer: AuthAccount) {
        if(signer.borrow<&NFluenceUtilityCoin>(from: NFluenceUtilityCoin.NFluenceUtilityCoinVaultStoragePath) != nil) {
            return
        }

        signer.save(<- NFluenceUtilityCoin.createEmptyVault(), to: NFluenceUtilityCoin.NFluenceUtilityCoinVaultStoragePath)
        signer.link<&NFluenceUtilityCoin.Vault{FungibleToken.Receiver}>(NFluenceUtilityCoin.NFluenceUtilityCoinReceiverPublicPath, target: NFluenceUtilityCoin.NFluenceUtilityCoinVaultStoragePath)
        signer.link<&NFluenceUtilityCoin.Vault{FungibleToken.Balance}>(NFluenceUtilityCoin.NFluenceUtilityCoinBalancePublicPath, target: NFluenceUtilityCoin.NFluenceUtilityCoinVaultStoragePath)
    }
}