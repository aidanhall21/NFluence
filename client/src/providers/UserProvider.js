import React, { createContext, useContext } from 'react'

import useUserNsfts from '../hooks/use-user-nsfts.hook'
import useCollection from '../hooks/use-collection.hook'
import { useAuth } from './AuthProvider'
import useCurrency from '../hooks/use-currency.hook'
import useProfileData from '../hooks/use-profile-data.hook'

const UserContext = createContext()

export default function UserProvider({ children }) {
    const { user, loggedIn } = useAuth()
    const { data: collection, createCollection, checkCollection } = useCollection(user)
    const { data: balance, createVault, getBalance } = useCurrency(user)
    const { data: profile, fetchUserData } = useProfileData(user, loggedIn)
    const { minted_data: userNsfts, txStatus: status, auction_data: userAuctions, mintNsft, settleAuction, loading, error, addToAuction, fetchAccountLiveAuctions, fetchUserMintedNsfts, bidOnAuction } = useUserNsfts(user)

    return (
        <UserContext.Provider
            value={{
                balance,
                profile,
                createVault,
                getBalance,
                user,
                userNsfts,
                mintNsft,
                loggedIn,
                collection,
                checkCollection,
                createCollection,
                bidOnAuction,
                fetchUserData,
                addToAuction,
                userAuctions,
                settleAuction,
                fetchAccountLiveAuctions,
                fetchUserMintedNsfts,
                loading,
                error,
                status
            }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext)
}