import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import NSFT from "../contracts/NSFT.cdc"

transaction(recipient: Address, cid: String, fileType: UInt8, title: String, description: String, editionSize: UInt16) {

    // local variable for storing the minter reference
    let receiverReference: &NSFT.Collection{NSFT.NSFTCollectionPublic}
    

    prepare(acct: AuthAccount) {
        self.receiverReference = getAccount(recipient).getCapability<&NSFT.Collection{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath).borrow()
            ?? panic("Could not borrow reference to Collection")
    }

    execute {
        NSFT.mintNFT(recipient: self.receiverReference, cid: cid, fileType: fileType, title: title, description: description, editionSize: editionSize)
    }
}
