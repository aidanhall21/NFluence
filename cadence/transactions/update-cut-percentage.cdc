import NFluenceAuction from "../contracts/NFluenceAuction.cdc"

transaction(newPercentage: UFix64) {

    prepare(signer: AuthAccount) {
        let adminRef = signer.borrow<&NFluenceAuction.Administrator>(from: NFluenceAuction.NFluenceAuctionAdminStorage)
                        ?? panic("Could not borrow Balance reference to the Vault")
        adminRef.updateCutPercentage(newPercentage: newPercentage)
    }
}