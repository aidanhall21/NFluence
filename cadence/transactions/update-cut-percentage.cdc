import NSFAuction from "../contracts/NSFAuction.cdc"
import UtilityCoin from "../contracts/UtilityCoin.cdc"

transaction(newPercentage: UFix64) {

    prepare(signer: AuthAccount) {
        let adminRef = signer.borrow<&NSFAuction.Administrator>(from: /storage/NSFAuctionAdmin)
                        ?? panic("Could not borrow Balance reference to the Vault")
        adminRef.updateCutPercentage(newPercentage: newPercentage)
    }
}