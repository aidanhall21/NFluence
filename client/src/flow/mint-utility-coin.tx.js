export const MINT_UTILITY_COIN = `
import FungibleToken from 0x9a0766d93b6608b7
import UtilityCoin from 0xUTILITYCOIN

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &UtilityCoin.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tokenAdmin = signer.borrow<&UtilityCoin.Administrator>(from: /storage/UtilityCoinAdmin)
            ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient)
            .getCapability(/public/utilityCoinReceiver)
            .borrow<&UtilityCoin.Vault{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let mintedVault <- minter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}
`