import React, { createContext, useContext } from 'react'

import useUserNsfts from '../hooks/use-user-nsfts.hook'
import useCollection from '../hooks/use-collection.hook'
import { useAuth } from './AuthProvider'
import useCurrency from '../hooks/use-currency.hook'
import useProfileData from '../hooks/use-profile-data.hook'

const UserContext = createContext()

export default function UserProvider({ children }) {
    const { user } = useAuth()
    const { data: collection, createCollection, checkCollection } = useCollection(user)
    const { data: balance, createVault, getBalance } = useCurrency(user)
    const { data: profile } = useProfileData(user)
    const { data: userNsfts, mintNsft, loading, error } = useUserNsfts(user, collection)

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
                collection,
                checkCollection,
                createCollection,
                loading,
                error
            }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    return useContext(UserContext)
}