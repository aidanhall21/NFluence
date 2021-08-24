export const MINT_NSFT = `
import NSFT from 0xNSFT

transaction(recipient: Address, cid: String, fileType: UInt8, title: String, description: String, editionSize: UInt16) {

    // local variable for storing the minter reference
    let receiverReference: &NSFT.Collection

    prepare(acct: AuthAccount) {
        self.receiverReference = acct.borrow<&NSFT.Collection>(from: NSFT.CollectionStoragePath)
            ?? panic("Could not borrow reference to Collection")
    }

    execute {
        NSFT.mintNFT(recipient: self.receiverReference, cid: cid, fileType: fileType, title: title, description: description, editionSize: editionSize)
    }
}
`