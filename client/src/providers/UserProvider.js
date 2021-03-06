import React, { createContext, useContext } from "react";

import useUserNsfts from "../hooks/use-user-nfts.hook";
import useCollection from "../hooks/use-collection.hook";
import { useAuth } from "./AuthProvider";
import useCurrency from "../hooks/use-currency.hook";
import useProfileData from "../hooks/use-profile-data.hook";

const UserContext = createContext();

export default function UserProvider({ children }) {
  const { user, loggedIn } = useAuth();
  const {
    data: collection,
    error: collectionError,
    loading: collectionLoading,
    createCollection,
    checkCollection,
    createFUSDVault
  } = useCollection(user);
  const { data: balance, createVault, getBalance } = useCurrency(user);
  const { data: profile, fetchUserData } = useProfileData(user, loggedIn);
  const {
    minted_data: userNsfts,
    txStatus: status,
    auction_data: userAuctions,
    fetchUserOwnedIds,
    owned_ids,
    owned_data: userOwned,
    bids_data: bids,
    errorText,
    mintNsft,
    settleAuction,
    loading,
    error,
    addToAuction,
    fetchAccountLiveAuctions,
    fetchUserOwnedNsfts,
    fetchUserMintedNsfts,
    bidOnAuction,
  } = useUserNsfts(user);

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
        createFUSDVault,
        bidOnAuction,
        fetchUserData,
        collectionError,
        collectionLoading,
        addToAuction,
        userAuctions,
        settleAuction,
        fetchAccountLiveAuctions,
        fetchUserOwnedNsfts,
        fetchUserMintedNsfts,
        fetchUserOwnedIds,
        owned_ids,
        bids,
        userOwned,
        loading,
        error,
        errorText,
        status,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  return useContext(UserContext);
};
