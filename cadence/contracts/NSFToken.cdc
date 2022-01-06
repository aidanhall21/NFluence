/*
### THIS CONTRACT IS CURRENTLY NOT IN USE
 */

import FungibleToken from "./FungibleToken.cdc"
import UtilityCoin from "./UtilityCoin.cdc"

pub contract NSFToken: FungibleToken {

    /// Total supply of NSFTokens in existence
    pub var totalSupply: UFix64
    pub var holders: {Address: UFix64}

    pub var providerCapability: Capability<&{FungibleToken.Provider}>
    pub var balanceCapability: Capability<&{FungibleToken.Balance}>
    pub var receiverCapability: Capability<&{FungibleToken.Receiver}>

    /// TokensInitialized
    ///
    /// The event that is emitted when the contract is created
    pub event TokensInitialized(initialSupply: UFix64)

    /// TokensWithdrawn
    ///
    /// The event that is emitted when tokens are withdrawn from a Vault
    pub event TokensWithdrawn(amount: UFix64, from: Address?)

    /// TokensDeposited
    ///
    /// The event that is emitted when tokens are deposited to a Vault
    pub event TokensDeposited(amount: UFix64, to: Address?)

    /// TokensMinted
    ///
    /// The event that is emitted when new tokens are minted
    pub event TokensMinted(amount: UFix64)

    /// TokensBurned
    ///
    /// The event that is emitted when tokens are destroyed
    pub event TokensBurned(amount: UFix64)

    /// MinterCreated
    ///
    /// The event that is emitted when a new minter resource is created
    pub event MinterCreated(allowedAmount: UFix64)

    /// BurnerCreated
    ///
    /// The event that is emitted when a new burner resource is created
    pub event BurnerCreated()

    /// Vault
    ///
    /// Each user stores an instance of only the Vault in their storage
    /// The functions in the Vault and governed by the pre and post conditions
    /// in FungibleToken when they are called.
    /// The checks happen at runtime whenever a function is called.
    ///
    /// Resources can only be created in the context of the contract that they
    /// are defined in, so there is no way for a malicious user to create Vaults
    /// out of thin air. A special Minter resource needs to be defined to mint
    /// new tokens.
    ///
    pub resource Vault: FungibleToken.Provider, FungibleToken.Receiver, FungibleToken.Balance {

        /// The total balance of this vault
        pub var balance: UFix64

        // initialize the balance at resource creation time
        init(balance: UFix64) {
            self.balance = balance
        }

        /// withdraw
        ///
        /// Function that takes an amount as an argument
        /// and withdraws that amount from the Vault.
        ///
        /// It creates a new temporary Vault that is used to hold
        /// the money that is being transferred. It returns the newly
        /// created Vault to the context that called so it can be deposited
        /// elsewhere.
        ///
        pub fun withdraw(amount: UFix64): @FungibleToken.Vault {
            self.balance = self.balance - amount
            emit TokensWithdrawn(amount: amount, from: self.owner?.address)
            return <-create Vault(balance: amount)
        }

        /// deposit
        ///
        /// Function that takes a Vault object as an argument and adds
        /// its balance to the balance of the owners Vault.
        ///
        /// It is allowed to destroy the sent Vault because the Vault
        /// was a temporary holder of the tokens. The Vault's balance has
        /// been consumed and therefore can be destroyed.
        ///
        pub fun deposit(from: @FungibleToken.Vault) {
            let vault <- from as! @NSFToken.Vault
            self.balance = self.balance + vault.balance
            emit TokensDeposited(amount: vault.balance, to: self.owner?.address)
            vault.balance = 0.0
            destroy vault
        }

        destroy() {
            NSFToken.totalSupply = NSFToken.totalSupply - self.balance
        }
    }

    /// createEmptyVault
    ///
    /// Function that creates a new Vault with a balance of zero
    /// and returns it to the calling context. A user must call this function
    /// and store the returned Vault in their storage in order to allow their
    /// account to be able to receive deposits of this token type.
    ///
    pub fun createEmptyVault(): @Vault {
        return <-create Vault(balance: 0.0)
    }

    pub resource Administrator {

        /// createNewMinter
        ///
        /// Function that creates and returns a new minter resource
        ///
        pub fun createNewMinter(allowedAmount: UFix64): @Minter {
            emit MinterCreated(allowedAmount: allowedAmount)
            return <-create Minter(allowedAmount: allowedAmount)
        }

        /// createNewBurner
        ///
        /// Function that creates and returns a new burner resource
        ///
        pub fun createNewBurner(): @Burner {
            emit BurnerCreated()
            return <-create Burner()
        }

        pub fun createNewDistributor(): @Distributor {
            return <-create Distributor()
        }


    }

    /// Minter
    ///
    /// Resource object that token admin accounts can hold to mint new tokens.
    ///
    pub resource Minter {

        /// The amount of tokens that the minter is allowed to mint
        pub var allowedAmount: UFix64

        /// mintTokens
        ///
        /// Function that mints new tokens, adds them to the total supply,
        /// and returns them to the calling context.
        ///
        pub fun mintTokens(amount: UFix64): @NSFToken.Vault {
            pre {
                amount > 0.0: "Amount minted must be greater than zero"
                amount <= self.allowedAmount: "Amount minted must be less than the allowed amount"
            }
            NSFToken.totalSupply = NSFToken.totalSupply + amount
            self.allowedAmount = self.allowedAmount - amount
            emit TokensMinted(amount: amount)
            return <-create Vault(balance: amount)
        }

        init(allowedAmount: UFix64) {
            self.allowedAmount = allowedAmount
        }
    }

    /// Burner
    ///
    /// Resource object that token admin accounts can hold to burn tokens.
    ///
    pub resource Burner {

        /// burnTokens
        ///
        /// Function that destroys a Vault instance, effectively burning the tokens.
        ///
        /// Note: the burned tokens are automatically subtracted from the
        /// total supply in the Vault destructor.
        ///
        pub fun burnTokens(from: @FungibleToken.Vault) {
            let vault <- from as! @NSFToken.Vault
            let amount = vault.balance
            destroy vault
            emit TokensBurned(amount: amount)
        }
    }

    // This additional resource would come into play in the future should we decide to implement "dividend" functionality
    // for each token. Essentially holders of the token would share in any future profits from auction settlements
    pub resource Distributor {

        pub fun distributeRewards(from: @FungibleToken.Vault) {
            let vault <- from as! @UtilityCoin.Vault
            let totalRewards = vault.balance
            for key in NSFToken.holders.keys {
                 
                let rewardAmount = NSFToken.holders[key]! / NSFToken.totalSupply * totalRewards

                let rewardeeCut <- vault.withdraw(amount: rewardAmount)

                let rewardee = getAccount(key)
                let rewardeeRef = rewardee.getCapability(/public/UtilityCoinReceiver).borrow<&{FungibleToken.Receiver}>()
                                        ?? panic("Could not borrow receiver reference to the recipient's Vault")
                rewardeeRef.deposit(from: <-rewardeeCut)
            }

            destroy vault
        }
    }



    init() {
        self.totalSupply = 6211995.0
        self.holders = {}

        let admin <- create Administrator()
        let minter <- admin.createNewMinter(allowedAmount: self.totalSupply)
        let distributor <- admin.createNewDistributor()
        self.account.save(<-admin, to: /storage/NSFTokenAdmin)

        let tokenVault <- minter.mintTokens(amount: self.totalSupply)
        self.account.save(<-tokenVault, to: /storage/NSFTokenVault)
        destroy minter

        self.account.save(<-distributor, to: /storage/NSFTokenDistributor)

        self.account.link<&NSFToken.Vault{FungibleToken.Balance}>(/public/NSFTokenBalance, target: /storage/NSFTokenVault)
        self.account.link<&NSFToken.Vault{FungibleToken.Receiver}>(/public/NSFTokenReceiver, target: /storage/NSFTokenVault)
        self.account.link<&NSFToken.Vault{FungibleToken.Provider}>(/public/NSFTokenProvider, target: /storage/NSFTokenVault)

        self.providerCapability = self.account.getCapability<&NSFToken.Vault{FungibleToken.Provider}>(/public/NSFTokenProvider)
        self.receiverCapability = self.account.getCapability<&NSFToken.Vault{FungibleToken.Receiver}>(/public/NSFTokenReceiver)
        self.balanceCapability = self.account.getCapability<&NSFToken.Vault{FungibleToken.Balance}>(/public/NSFTokenBalance)
        // Emit an event that shows that the contract was initialized
        //
        emit TokensInitialized(initialSupply: self.totalSupply)
    }
}
