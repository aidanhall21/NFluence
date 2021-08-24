import NSFT from "../contracts/NSFT.cdc"

pub fun main(): UInt64 {
    let totalSupply = NSFT.totalSupply
    return totalSupply
}