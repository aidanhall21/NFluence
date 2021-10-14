import NFluence from "../contracts/NFluence.cdc"

transaction(newSize: UInt16) {

    prepare(signer: AuthAccount) {
        let adminRef = signer.borrow<&NFluence.NFluenceAdmin>(from: NFluence.AdminStoragePath)
                        ?? panic("Could not borrow Balance reference to the Vault")
        adminRef.updateMaxEditionSize(newSize: newSize)
    }
}