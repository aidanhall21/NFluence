/*
This is the main contract that manages data and behavior for minted NFTs on
the NSFT platform
 */

import NonFungibleToken from "./NonFungibleToken.cdc"

pub contract NSFT: NonFungibleToken {

    // Path variables
    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let AdminStoragePath: StoragePath
    // This variable controls the max number of editions of a single NFT you're allowed to mint
    // It's possible for this to change as scaling and transaction fees become less of an issue
    access(account) var maxEditionSize: UInt16
    pub var totalSupply: UInt64


    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)
    pub event Created(id: UInt64, user: Address)
    pub event Destroyed(id: UInt64)

    // A data structure that contains matadata fields for a single NFT
    pub struct NSFData {

      pub let nftId: UInt64
      // The IPFS cid for the file that will be minted into an NFT
      pub let cid: String
      // Currently either 0 (image) or 1 (video)
      pub let fileType: UInt8
      pub let title: String
      pub let description: String
      pub let creatorAddress: Address
      pub var serial: UInt16
      // Number of NFTs in the edition
      pub let editionSize: UInt16

      init(nftId: UInt64, cid: String, fileType: UInt8, title: String, description: String, creatorAddress: Address, serial: UInt16, editionSize: UInt16) {

        self.nftId = nftId
        assert(cid.length > 0, message: "NFT must contain an IPFS hash string")
        self.cid = cid
        assert(fileType == 0 || fileType == 1, message: "fileType must have an integer value of zero or one" )
        self.fileType = fileType
        self.title = title
        self.description = description
        self.creatorAddress = creatorAddress
        self.serial = serial
        self.editionSize = editionSize
      }
    }

    // Publically available data and functions for the NFT
    pub resource interface NSFTPublic {

        pub let id: UInt64
        pub fun getData(): NSFData
    }

    pub resource NFT: NonFungibleToken.INFT, NSFTPublic {

        access(self) let metadata: NSFData
        pub let id: UInt64

        init(cid: String, fileType: UInt8, title: String, description: String, creatorAddress: Address, serial: UInt16, editionSize: UInt16) {
            pre {
                editionSize <= NSFT.maxEditionSize : "You're trying to mint too many NFTs at once"
            }

            self.id = NSFT.totalSupply
            NSFT.totalSupply = NSFT.totalSupply + 1
            self.metadata = NSFData(
                nftId: self.id,
                cid: cid,
                fileType: fileType,
                title: title,
                description: description,
                creatorAddress: creatorAddress,
                serial: serial,
                editionSize: editionSize
            )

            emit Created(id: self.id, user: creatorAddress)
        }

        // Getter function for the NFT metadata
        pub fun getData(): NSFData {
            return self.metadata
        }

        destroy() {
            emit Destroyed(id: self.id)
        }
    }

    // Publically available data and functions for the NFT Collection
    pub resource interface NSFTCollectionPublic {

        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        // Get list of ids for all NFTs in the collection
        pub fun getIDs(): [UInt64]
        // Get metadata for a specific NFT
        pub fun getTokenData(id: UInt64): NSFData {
            // If the result isn't nil, the id of the returned reference
            // should be the same as the argument to the function
            post {
                (result == nil) || (result.nftId == id):
                    "Cannot get token data: The ID of the returned reference is incorrect"
            }
        }
        pub fun getAllTokenData(): [NSFData]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        // Function that returns reference to the whole public facing NSFT Resource
        pub fun borrowNSFT(id: UInt64): &NSFT.NFT {
            post {
                (result == nil) || (result.id == id): 
                    "Cannot borrow Moment reference: The ID of the returned reference is incorrect"
            }
        }

    }

    pub resource Collection: NSFTCollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NSFT.NFT {
            pre {
                self.ownedNFTs[withdrawID] != nil : "NFT does not exist in the collection"
            }
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")
            emit Withdraw(id: token.id, from: self.owner?.address)
            let item <-token as! @NSFT.NFT
            return <-item
        }

        pub fun batchWithdraw(ids: [UInt64]): @NonFungibleToken.Collection {
            // Create a new empty Collection
            var batchCollection <- create Collection()
            
            // Iterate through the ids and withdraw them from the Collection
            for id in ids {
                batchCollection.deposit(token: <-self.withdraw(withdrawID: id))
            }
            
            // Return the withdrawn tokens
            return <-batchCollection
        }

        // deposit takes an NFT and adds it to the collections dictionary
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @NSFT.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token
            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }
            destroy oldToken
        }

        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {

            // Get an array of the IDs to be deposited
            let keys = tokens.getIDs()
            // Iterate through the keys in the collection and deposit each one
            for key in keys {
                self.deposit(token: <-tokens.withdraw(withdrawID: key))
            }
            // Destroy the empty Collection
            destroy tokens
        }

        // Returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun getTokenData(id: UInt64): NSFData {
            pre {
                self.ownedNFTs[id] != nil : "NFT does not exist in the collection"
            }
            let token = self.borrowNSFT(id: id)
            return token.getData()
        }

        pub fun getAllTokenData(): [NSFData] {
            var tokens: [NSFData] = []
            for key in self.ownedNFTs.keys {
                tokens.append(self.getTokenData(id: key))
            }
            return tokens
        }
        
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            pre {
                self.ownedNFTs[id] != nil : "NFT does not exist in the collection"
            }
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        pub fun borrowNSFT(id: UInt64): &NSFT.NFT {
            pre {
                self.ownedNFTs[id] != nil : "NFT does not exist in the collection"
            }
            let ref = &self.ownedNFTs[id] as auth &NonFungibleToken.NFT
            return ref as! &NSFT.NFT
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    // Function creates a new empty collection
    pub fun createEmptyCollection(): @Collection {
        return <- create self.Collection()
    }

    // This function takes metadata arguments as well as an editionSize parameter
    // which will mint multiple NFTs with the same metadata and increasing serial numbers
    pub fun mintNFT(recipient: &NSFT.Collection{NSFT.NSFTCollectionPublic}, cid: String, fileType: UInt8, title: String, description: String, editionSize: UInt16) {
        pre {
            editionSize <= NSFT.maxEditionSize : "You're trying to mint too many NFTs at once"
            recipient != nil : "Must have a valid NSFT Collection available in order to mint"
        }
        var a = editionSize
        let creatorAddress = recipient.owner!.address
        while a > 0 {
            var newNFT <- create NFT(cid: cid, fileType: fileType, title: title, description: description, creatorAddress: creatorAddress, serial: a, editionSize: editionSize)
            recipient.deposit(token: <-newNFT)
            a = a - 1
        }
    }

    // An admin resource that contains administrative functions for this contract
    pub resource NSFTAdmin {
        // Allows the contract owner to update the maximum number of NFTs allowed to be minted at once
        pub fun updateMaxEditionSize(newSize: UInt16) {
            pre {
                newSize > 0 : "Must be a positive non zero integer"
            }

            NSFT.maxEditionSize = newSize
        }
    }



    init() {
        // Initialize the total supply and max edition size variables
        self.totalSupply = 0
        self.maxEditionSize = 10
        // Initialize Collection paths
        self.CollectionPublicPath = /public/NFTCollection
        self.CollectionStoragePath = /storage/NFTCollection
        self.AdminStoragePath = /storage/NSFTAdmin
        // Create the admin resource and store it in the account that deployed this contract
        let admin <- create NSFTAdmin()
        self.account.save(<-admin, to: NSFT.AdminStoragePath)
        // Create a Collection resource and save it to storage
        self.account.save<@Collection>(<- create Collection(), to: NSFT.CollectionStoragePath)
        // create a public capability for the collection
        self.account.link<&{NSFT.NSFTCollectionPublic}>(NSFT.CollectionPublicPath, target: NSFT.CollectionStoragePath)
        emit ContractInitialized()
    }
}

