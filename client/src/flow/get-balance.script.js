export const GET_BALANCE = `
import FungibleToken from 0x9a0766d93b6608b7
import UtilityCoin from 0xUTILITYCOIN

pub fun main(account: Address): UFix64 {
    let acct = getAccount(account)
    let vaultRef = acct.getCapability(/public/utilityCoinBalance).borrow<&UtilityCoin.Vault{FungibleToken.Balance}>()
                        ?? panic("Could not borrow Balance reference to the Vault")
    return vaultRef.balance
}
`