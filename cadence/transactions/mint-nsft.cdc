import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import NFluence from "../contracts/NFluence.cdc"

transaction(recipient: Address, cid: String, fileType: UInt8, title: String, description: String, editionSize: UInt16) {

    // local variable for storing the minter reference
    let receiverReference: &NFluence.Collection{NFluence.NFluenceCollectionPublic}
    

    prepare(acct: AuthAccount) {
        self.receiverReference = getAccount(recipient).getCapability<&NFluence.Collection{NFluence.NFluenceCollectionPublic}>(NFluence.CollectionPublicPath).borrow()
            ?? panic("Could not borrow reference to Collection")
    }

    execute {
        NFluence.mintNFT(recipient: self.receiverReference, cid: cid, fileType: fileType, title: title, description: description, editionSize: editionSize)
    }
}