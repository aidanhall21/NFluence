// This script reads the balance field of an account's FlowToken Balance

import FungibleToken from "../contracts/FungibleToken.cdc"
import UtilityCoin from "../contracts/UtilityCoin.cdc"

pub fun main(account: Address): UFix64 {
    let acct = getAccount(account)
    let vaultRef = acct.getCapability(/public/utilityCoinBalance).borrow<&UtilityCoin.Vault{FungibleToken.Balance}>()
                        ?? panic("Could not borrow Balance reference to the Vault")
    return vaultRef.balance
}
