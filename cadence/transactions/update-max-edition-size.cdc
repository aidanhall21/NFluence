import NSFT from "../contracts/NSFT.cdc"

transaction(newSize: UInt16) {

    prepare(signer: AuthAccount) {
        let adminRef = signer.borrow<&NSFT.NSFTAdmin>(from: /storage/NSFTAdmin)
                        ?? panic("Could not borrow Balance reference to the Vault")
        adminRef.updateMaxEditionSize(newSize: newSize)
    }
}