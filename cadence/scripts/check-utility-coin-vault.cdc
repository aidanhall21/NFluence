import FungibleToken from "../contracts/FungibleToken.cdc"
import UtilityCoin from "../contracts/UtilityCoin.cdc"

pub fun main(addr: Address): Bool {
    let receiver = getAccount(addr).getCapability<&UtilityCoin.Vault{FungibleToken.Receiver}>(/public/utilityCoinReceiver).check()
    let balance = getAccount(addr).getCapability<&UtilityCoin.Vault{FungibleToken.Balance}>(/public/utilityCoinBalance).check()

    return receiver && balance
}