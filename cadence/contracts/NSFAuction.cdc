/*
This is a multifaceted contract that sets up an auction resource, the parameters for 
running an auctions and setting up an account storefront to store all active auctions
 */

import FungibleToken from "./FungibleToken.cdc"
import NonFungibleToken from "./NonFungibleToken.cdc"
import NSFT from "./NSFT.cdc"
import UtilityCoin from "./UtilityCoin.cdc"

pub contract NSFAuction {

    // The total amount of AuctionItems that have been created
    pub var totalAuctions: UInt64
    // The percentage of the final sale price that gets allocated to the platform 
    access(account) var cutPercentage: UFix64
    access(account) let cutVault: @FungibleToken.Vault
    // The location in storage that a Storefront resource should be located.
    pub let StorefrontStoragePath: StoragePath
    // The public location for a Storefront link.
    pub let StorefrontPublicPath: PublicPath

    pub event NSFAuctionContractInitialized()
    pub event AuctionCreated(tokenID: UInt64, user: Address, startPrice: UFix64)
    pub event BidPlaced(tokenID: UInt64?, user: Address, bidPrice: UFix64)
    pub event BidReceived(tokenID: UInt64?, user: Address, bidPrice: UFix64)
    pub event Settled(tokenID: UInt64?, price: UFix64, user: Address, winner: Address?)
    pub event SettledNoBids(tokenID: UInt64, user: Address)
    pub event Canceled(tokenID: UInt64, user: Address)
    pub event StorefrontInitialized(storefrontResourceID: UInt64)
    pub event StorefrontDestroyed(storefrontResourceID: UInt64)

    // This struct contains most of the critical data pertaining to a particular auction
    pub struct AuctionData{

        // Unique id for a single auction
        // Should match total auctions at time of creation
        pub let auctionId: UInt64
        // Current price of the NFT that's being auctioned
        pub let price: UFix64
        // Current number of bids for this auction
        pub let numBids: UInt64
        pub let timeRemaining: Fix64
        pub let endTime: UFix64
        pub let startTime: UFix64
        // NFT metadata
        pub let nftData: NSFT.NSFData?
        // The address of the user with the current winning bid
        pub let leader: Address?
        // Used as an input check for bids
        pub let minNextBid: UFix64
        pub let settled: Bool
        // Expired means the time remaining to bid has elapsed, but the auction may still not be settled
        pub let expired: Bool
    
        init(currentPrice: UFix64,
            timeRemaining: Fix64, 
            nftData: NSFT.NSFData?,
            leader: Address?, 
            startTime: UFix64,
            endTime: UFix64,
            minNextBid: UFix64,
            completed: Bool,
            expired: Bool
        ) {
            self.auctionId = NSFAuction.totalAuctions
            self.price = currentPrice
            self.numBids = 0
            self.timeRemaining = timeRemaining
            self.nftData = nftData
            self.leader = leader
            self.startTime = startTime
            self.endTime = endTime
            self.minNextBid = minNextBid
            self.settled = completed
            self.expired = expired
        }
    }

    // Data that applies to a particular bid made by a user on an NFT currently in a live auction
    pub struct Bid {
        // The order in which this bid was made, starting at 0
        pub let bidSequence: UInt64
        pub let bidAmount: UFix64
        // Capability to the vault that contains the token the NFT owner will receive if this bid wins the auction
        pub let bidder: Address

        init(bidSequence: UInt64, bidAmount: UFix64, bidderReceiver: Capability<&{FungibleToken.Receiver}>) {
            self.bidSequence = bidSequence
            self.bidAmount = bidAmount
            self.bidder = bidderReceiver.borrow()!.owner!.address
        }
    }

    pub resource interface AuctionPublic {
        pub fun getNFTData() : NSFT.NSFData?
        pub fun getBidHistory(): [Bid]
        pub fun currentHighestBidder() : Address
        pub fun timeRemaining(): Fix64
        pub fun isAuctionExpired(): Bool
        pub fun minNextBid(): UFix64
        pub fun currentBidForUser(address: Address): UFix64
        pub fun getAuctionData(): AuctionData
        pub fun placeBid(bidTokens: @FungibleToken.Vault, vaultCap: Capability<&{FungibleToken.Receiver}>, collectionCap: Capability<&{NSFT.NSFTCollectionPublic}>)
    }

    // AuctionItem contains the Resources and metadata for a single auction
    // Functions pertaining to auctions
    pub resource AuctionItem: AuctionPublic {
        
        // Number of bids made, that is aggregated to the data struct
        pub var numberOfBids: UInt64
        // The Item that is sold at this auction
        pub var NFT: @NSFT.NFT?
        // Bid history is stored on chain
        pub var bidHistory: [Bid]
        // This is the escrow vault that holds the tokens for the current largest bid
        pub let bidVault: @FungibleToken.Vault
        // The id of this individual auction
        pub let auctionID: UInt64
        // The minimum increase in price a new bid on the auction must conform to
        // At the moment this is set at $1 but eventually the functionality for the user to customize this value will exist
        pub let minimumBidIncrement: Int32
        // The time the auction should start at
        pub var auctionStartTime: UFix64
        //The length in seconds for this auction
        pub var auctionLength: UFix64
        // If true the auction has been fully settled
        pub var auctionCompleted: Bool
        pub var startPrice: UFix64
        pub var currentPrice: UFix64
        // The capability that points to the resource where you want the NFT transfered to if you win this auction 
        pub var recipientCollectionCap: Capability<&{NSFT.NSFTCollectionPublic}>
        // The capablity to send the escrow bidVault back to if you are outbid
        pub var recipientVaultCap: Capability<&{FungibleToken.Receiver}>
        // The capability for the owner of the NFT to return the item to if the auction is cancelled or settled without a bid
        pub let ownerCollectionCap: Capability<&{NSFT.NSFTCollectionPublic}>
        // The capability to pay the owner of the item when the auction is done
        pub let ownerVaultCap: Capability<&{FungibleToken.Receiver}>

        init(
            NFT: @NSFT.NFT,
            minimumBidIncrement: Int32,
            auctionStartTime: UFix64,
            startPrice: UFix64,
            auctionLength: UFix64,
            ownerCollectionCap: Capability<&{NSFT.NSFTCollectionPublic}>,
            ownerVaultCap: Capability<&{FungibleToken.Receiver}>,
        ) {
            self.NFT <- NFT
            self.bidVault <- UtilityCoin.createEmptyVault()
            self.auctionID = NSFAuction.totalAuctions
            self.minimumBidIncrement = minimumBidIncrement
            self.auctionLength = auctionLength
            self.startPrice = startPrice
            self.currentPrice = startPrice // Why this?
            self.auctionStartTime = auctionStartTime
            self.auctionCompleted = false
            // recipient collection and vault capabilities set to the owner collection and vault capabilities
            // initially so that if the auction is settled without a bid then the NFT and vault tokens would go back to the original owner
            self.recipientCollectionCap = ownerCollectionCap
            self.recipientVaultCap = ownerVaultCap
            self.ownerCollectionCap = ownerCollectionCap
            self.ownerVaultCap = ownerVaultCap
            self.numberOfBids = 0
            self.bidHistory = []

            NSFAuction.totalAuctions = NSFAuction.totalAuctions + (1 as UInt64)
        }
        
        // Function to get the metadata of the NFT being auctioned
        pub fun getNFTData() : NSFT.NSFData? {
            return self.NFT?.getData()
        }

        pub fun getBidHistory(): [Bid] {
            return self.bidHistory
        }

        // Sends the NFT to the Collection belonging to the provided Capability
        access(contract) fun sendNFTToWinner() {

            if let collectionRef = self.recipientCollectionCap.borrow() {
                let nft <- self.NFT <- nil
                collectionRef.deposit(token: <- nft!)
            }
        }

        // sendBidTokens sends the bid tokens to the Vault Receiver belonging to the provided Capability
        access(contract) fun sendBidTokensToOwner() {

            if let vaultRef = self.ownerVaultCap.borrow() {
                let bidVaultRef = &self.bidVault as &FungibleToken.Vault
                if(bidVaultRef.balance > 0.0) {
                    vaultRef.deposit(from: <-bidVaultRef.withdraw(amount: bidVaultRef.balance))
                }
            }
        }

        access(contract) fun releasePreviousBid() {
            if let vaultRef = self.recipientVaultCap.borrow() {
                let bidVaultRef = &self.bidVault as &FungibleToken.Vault
                if(bidVaultRef.balance > 0.0) {
                    vaultRef.deposit(from: <-bidVaultRef.withdraw(amount: bidVaultRef.balance))
                }
            } 
        }

        pub fun currentHighestBidder() : Address {
            return self.recipientVaultCap.borrow()!.owner!.address
        }

        // If an auction is settled with no bids or cancelled
        pub fun returnNFTToOwner() {

            // release any bidder's tokens
            if self.numberOfBids > 0 {
                self.releasePreviousBid()
            }
            // deposit the NFT back into the owner's collection
            if let collectionRef = self.ownerCollectionCap.borrow() {
                let nft <- self.NFT <- nil
                collectionRef.deposit(token: <- nft!)
            }
         }

        // Sends NFT to the hightest bidder or back to the original owner if no bids
        // Resolves all transfer of bid funds as well
        pub fun settleAuction()  {

            pre {
                !self.auctionCompleted : "This auction has already been settled"
                self.NFT != nil : "NFT in auction does not exist"
            }

            let sellerAddress = self.ownerVaultCap.borrow()!.owner!.address
            let buyerAddress = self.currentHighestBidder()

            // Return item to owner if there are no bids to settle
            if self.numberOfBids == (0 as UInt64) {
                self.returnNFTToOwner()
                emit SettledNoBids(tokenID: self.auctionID, user: sellerAddress)
                return
            }            

            // Withdraw the contracts cut of the winning bids funds
            let cutAmount = self.currentPrice * (NSFAuction.cutPercentage / 100.0)
            let cutTokens <- self.bidVault.withdraw(amount: cutAmount)
            NSFAuction.cutVault.deposit(from: <- cutTokens)

            self.sendNFTToWinner()
            self.sendBidTokensToOwner()
            self.auctionCompleted = true
            
            emit Settled(tokenID: self.getNFTData()?.nftId, price: self.currentPrice, user: sellerAddress, winner: buyerAddress)
        }

        // This can be negative if the auction has expired
        pub fun timeRemaining(): Fix64 {
            return Fix64(self.auctionStartTime + self.auctionLength) - Fix64(getCurrentBlock().timestamp)
        }

        pub fun isAuctionExpired(): Bool {
            let timeRemaining = self.timeRemaining()
            return timeRemaining < Fix64(0.0)
        }

        pub fun minNextBid(): UFix64 {
            return self.currentPrice + UFix64(self.minimumBidIncrement)
        }

        // Extend an auction with a given set of seconds
        pub fun extendWith(_ amount: UFix64) {
            pre {
                amount > 0.0 : "Cannot extend an auction by a negative amount"
            }
            self.auctionLength = self.auctionLength + amount
        }

        // Returns the last bid made by a user regardless of if it's the current winning bid
        pub fun currentBidForUser(address: Address): UFix64 {
             if(self.currentHighestBidder() == address) {
                return self.bidVault.balance
            }

            for bid in self.bidHistory {
                if bid.bidder == address {
                    return bid.bidAmount
                }
            }

            return 0.0
        }

        pub fun cancelAuction() {

            emit Canceled(tokenID: self.getNFTData()!.nftId, user: self.ownerVaultCap.borrow()!.owner!.address)
            self.returnNFTToOwner()
            self.auctionCompleted = true
        }

        pub fun placeBid(bidTokens: @FungibleToken.Vault, vaultCap: Capability<&{FungibleToken.Receiver}>, collectionCap: Capability<&{NSFT.NSFTCollectionPublic}>) {

            pre {
                !self.auctionCompleted : "The auction is already settled"
                self.NFT != nil: "NFT in auction does not exist"
                self.timeRemaining() > 0.0: "Time to place bids has elapsed"
                bidTokens.balance > self.minNextBid() : "Bid amount must be larger or equal to the current price + minimum bid increment"
            }

            let bidderAddress = vaultCap.borrow()!.owner!.address
            let ownerAddress = self.ownerCollectionCap.borrow()!.owner!.address

            // Send current tokens in bid vault back to previous bidder
            self.releasePreviousBid()

            // Deposit new bid tokens
            self.bidVault.deposit(from: <-bidTokens)
 
            self.recipientVaultCap = vaultCap
            self.currentPrice = self.bidVault.balance

            // Add the bidder's Vault and NFT receiver references
            self.recipientCollectionCap = collectionCap
            let element = Bid(bidSequence: self.numberOfBids, bidAmount: self.bidVault.balance, bidderReceiver: vaultCap)

            self.bidHistory.insert(at: self.numberOfBids, element)
            self.numberOfBids = self.numberOfBids + (1 as UInt64)

            // If there's less than ~10 minutes left in the auction the time gets extended
            if self.timeRemaining() < 600.0 {
                let timeToExtend = (600.0 as Fix64) - self.timeRemaining()
                self.extendWith(UFix64(timeToExtend))
            }


            emit BidPlaced(tokenID: self.NFT?.id, user: bidderAddress, bidPrice: self.currentPrice)
            emit BidReceived(tokenID: self.NFT?.id, user: ownerAddress, bidPrice: self.currentPrice)
        }

        pub fun getAuctionData(): AuctionData {

            return AuctionData(
                currentPrice: self.currentPrice,
                timeRemaining: self.timeRemaining(), 
                nftData: self.NFT?.getData(),
                leader: self.recipientCollectionCap.borrow()!.owner!.address, 
                startTime: self.auctionStartTime,
                endTime: self.auctionStartTime + self.auctionLength,
                minNextBid: self.minNextBid(),
                completed: self.auctionCompleted,
                expired: self.isAuctionExpired()
            )
        }

        destroy() {
            log("destroy auction")
            // send the NFT back to auction owner
            if self.NFT != nil {
                self.returnNFTToOwner()
            }
        
            // ...send the bid tokens back to the bidder
            self.releasePreviousBid()

            destroy self.NFT
            destroy self.bidVault
        }
    }

    // An interface for adding and removing Listings within a Storefront,
    // intended for use by the Storefront's owner
    pub resource interface StorefrontManager {

        pub fun createAuction(
            token: @NSFT.NFT, 
            minimumBidIncrement: Int32, 
            auctionLength: UFix64,
            auctionStartTime: UFix64,
            startPrice: UFix64,
            collectionCap: Capability<&{NSFT.NSFTCollectionPublic}>, 
            vaultCap: Capability<&{FungibleToken.Receiver}>)

        // removing an auction from the storefront is effectively canceling the auction
        pub fun removeListing(listingResourceID: UInt64)
        pub fun settleListing(listingResourceID: UInt64)
    }

    pub resource interface StorefrontPublic {
        pub fun getListingIDs(): [UInt64]
        pub fun borrowListing(listingResourceID: UInt64): &AuctionItem{AuctionPublic}?
   }

    pub resource Storefront : StorefrontManager, StorefrontPublic {

        access(self) var listings: @{UInt64: AuctionItem}

        pub fun createAuction(
            token: @NSFT.NFT, 
            minimumBidIncrement: Int32, 
            auctionLength: UFix64,
            auctionStartTime: UFix64,
            startPrice: UFix64,
            collectionCap: Capability<&{NSFT.NSFTCollectionPublic}>, 
            vaultCap: Capability<&{FungibleToken.Receiver}>) {
            let listing <- create AuctionItem(
                NFT: <- token,
                minimumBidIncrement: minimumBidIncrement,
                auctionStartTime: auctionStartTime,
                startPrice: startPrice,
                auctionLength: auctionLength,
                ownerCollectionCap: collectionCap,
                ownerVaultCap: vaultCap,
            )

            let listingPrice = listing.getAuctionData().price
            let nftId = listing.getNFTData()!.nftId
            let creatorAddress = listing.getNFTData()!.creatorAddress
            let listingResourceID = nftId

            // Add the new listing to the dictionary.
            let oldListing <- self.listings[nftId] <- listing
            destroy oldListing

            emit AuctionCreated(tokenID: nftId, user: creatorAddress, startPrice: listingPrice)
        }

        // Remove a Listing that has not yet been purchased from the collection and destroy it.
        pub fun removeListing(listingResourceID: UInt64) {
            let listing <- self.listings.remove(key: listingResourceID)
                ?? panic("missing Listing")

            listing.cancelAuction()
            destroy listing
        }

        pub fun settleListing(listingResourceID: UInt64) {
            let listing <- self.listings.remove(key: listingResourceID) ?? panic("missing Listing")
            listing.settleAuction()
            destroy listing
        }

        pub fun getListingIDs(): [UInt64] {
            return self.listings.keys
        }

        pub fun borrowListing(listingResourceID: UInt64): &AuctionItem{AuctionPublic}? {
            if self.listings[listingResourceID] != nil {
                return &self.listings[listingResourceID] as! &AuctionItem{AuctionPublic}
            } else {
                return nil
            }
        }

        destroy () {
            destroy self.listings
            emit StorefrontDestroyed(storefrontResourceID: self.uuid)
        }

        init () {
            self.listings <- {}

            emit StorefrontInitialized(storefrontResourceID: self.uuid)
        }
    }

    pub fun createStorefront(): @Storefront {
        return <-create Storefront()
    }

    // An admin resource that contains administrative functions for this contract
    pub resource Administrator {

        pub fun updateCutPercentage(newPercentage: UFix64) {
            pre {
                newPercentage > 1.0 : "New percentage must be between 1 and 100"
            }

            NSFAuction.cutPercentage = newPercentage
        }

        pub fun retrieveCutVault(): @FungibleToken.Vault {
            let cutVaultAmount = NSFAuction.cutVault.balance
            return <- NSFAuction.cutVault.withdraw(amount: cutVaultAmount)
        }
    }



    init() {
        self.StorefrontStoragePath = /storage/NFTStorefront
        self.StorefrontPublicPath = /public/NFTStorefront

        let admin <- create Administrator()
        self.account.save(<-admin, to: /storage/NSFAuctionAdmin)

        self.cutVault <- UtilityCoin.createEmptyVault()

        emit NSFAuctionContractInitialized()
        self.totalAuctions = (0 as UInt64)
        self.cutPercentage = 20.0
    }   
}
 