import FungibleToken from 0x9a0766d93b6608b7
import NFluenceUtilityCoin from "../contracts/NFluenceUtilityCoin.cdc"

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &NFluenceUtilityCoin.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {
        self.tokenAdmin = signer.borrow<&NFluenceUtilityCoin.Administrator>(from: NFluenceUtilityCoin.NFluenceUtilityCoinAdminStoragePath)
            ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient)
            .getCapability(NFluenceUtilityCoin.NFluenceUtilityCoinReceiverPublicPath)
            .borrow<&NFluenceUtilityCoin.Vault{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let mintedVault <- minter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}