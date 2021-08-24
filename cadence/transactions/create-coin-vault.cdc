import FungibleToken from "../contracts/FungibleToken.cdc"
import UtilityCoin from "../contracts/UtilityCoin.cdc"

transaction {
    prepare(signer: AuthAccount) {
        if(signer.borrow<&UtilityCoin>(from: /storage/utilityCoinVault) != nil) {
            return
        }

        signer.save(<- UtilityCoin.createEmptyVault(), to: /storage/utilityCoinVault)
        signer.link<&UtilityCoin.Vault{FungibleToken.Receiver}>(/public/utilityCoinReceiver, target: /storage/utilityCoinVault)
        signer.link<&UtilityCoin.Vault{FungibleToken.Balance}>(/public/urilityCoinBalance, target: /storage/utilityCoinVault)
    }
}