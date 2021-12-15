import { useEffect, useReducer } from "react";
import { userNsftReducer } from "../reducer/userNsftReducer";
import { mutate, query, tx } from '@onflow/fcl';
import { MINT_NSFT } from "../flow/mint-nsft.tx";
import { GET_TOKEN_DATA } from "../flow/get-token-data.script";
import { CREATE_AUCTION } from "../flow/create-auction.tx";
import { GET_AUCTION_IDS } from "../flow/get-auction-ids.script";
import { GET_SINGLE_AUCTION_DATA } from "../flow/get-single-auction-data.script";
import { SETTLE_AUCTION } from "../flow/settle-auction.tx";
import { BID_ON_AUCTION } from "../flow/bid-auction.tx";
import { GET_OWNED_IDS } from "../flow/get-owned-token-ids.script";
import axios from "axios";

export default function useUserNsfts(user) {
    const [state, dispatch] = useReducer(userNsftReducer, {
        loading: false,
        error: false,
        minted_data: [],
        auction_data: [],
        owned_data: [],
        owned_ids: [],
        bids_data: [],
        txStatus: {},
        errorText: ''
    })

    const runScript = async (address, id) => {
        let auction_data;
        try {
            auction_data = await query({
                cadence: GET_SINGLE_AUCTION_DATA,
                args: (arg, t) => [arg(address, t.Address), arg(id, t.UInt64)]
            })
        } catch (err) {
            return
        }
        const { nftData } = auction_data
        return {...auction_data, ...nftData}
    }

    const fetchAuctionData = async (address, data) => {
        return Promise.all(data.map((id) => {
            return runScript(address, id)
        }))
    }

    const fetchBidData = async (data) => {
        console.log(data)
        return Promise.all(data.map((el) => {
            return runScript(el.blockEventData.owner, el.blockEventData.tokenID)
        }))
    }

    const fetchUserMintedNsfts = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await query({
                cadence: GET_TOKEN_DATA,
                args: (arg, t) => [arg(user?.addr, t.Address)]
            })
            let minted_nsfts = []
            if (res !== null) {
                minted_nsfts = res.filter(token => token.creatorAddress === user?.addr)
            }
            minted_nsfts.sort((a, b) => a.nftId - b.nftId)
            dispatch({ type: 'MINTED_SUCCESS', payload: minted_nsfts })
        } catch (err) {
            console.log(err)
            dispatch({ type: 'ERROR', payload: err })
        }
    }

    const fetchUserOwnedIds = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await query({
                cadence: GET_OWNED_IDS,
                args: (arg, t) => [arg(user?.addr, t.Address)]
            })
            let owned_nsfts = []
            if (res !== null) {
                owned_nsfts = res.filter(token => token.creatorAddress !== user?.addr)
            }
            owned_nsfts.sort((a, b) => a.nftId - b.nftId)
            dispatch({ type: 'ID_SUCCESS', payload: owned_nsfts })
        } catch(err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    const fetchUserOwnedNsfts = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await query({
                cadence: GET_TOKEN_DATA,
                args: (arg, t) => [arg(user?.addr, t.Address)]
            })
            console.log(res)
            let owned_nsfts = []
            if (res !== null) {
                owned_nsfts = res.filter(token => token.creatorAddress !== user?.addr)
            }
            owned_nsfts.sort((a, b) => a.nftId - b.nftId)
            dispatch({ type: 'OWNED_SUCCESS', payload: owned_nsfts })
        } catch (err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    const fetchUserLiveAuctions = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await query({
                cadence: GET_AUCTION_IDS,
                args: (arg, t) => [arg(user?.addr, t.Address)]
            })
            let data = await fetchAuctionData(user?.addr, res)
            data.sort((a, b) => parseFloat(a.timeRemaining) - parseFloat(b.timeRemaining))
            dispatch({ type: 'AUCTION_SUCCESS', payload: data })
        } catch(err) {
            dispatch({ type: 'ERROR' })
        }
    }

    const fetchUserLiveBids = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let response = await axios.get(`https://prod-test-net-dashboard-api.azurewebsites.net/api/company/04a74a09-619e-47f3-a6b4-99d24ce69971/search?user=${user?.addr}`)
            const bidData = response.data;
            const result = bidData.filter(event => event.flowEventId === "A.a3c018ee20b2cb65.NFluenceAuction.BidPlaced")
            let tokens = result.filter((event, index, self) => 
                index === self.findIndex((e) => (
                    e.blockEventData.tokenID === event.blockEventData.tokenID
                ))
            )
            let livebids = await fetchBidData(tokens)
            livebids = livebids.filter(bid => bid !== undefined)
            dispatch({ type: 'BID_SUCCESS', payload: livebids })
        } catch(err) {
            dispatch({ type: 'ERROR' })
        }

    }

    useEffect(() => {
        if(!user?.addr) return
        fetchUserMintedNsfts()
        fetchUserOwnedNsfts()
        fetchUserOwnedIds()
        fetchUserLiveAuctions()
        fetchUserLiveBids()
        //eslint-disable-next-line
    }, [user])


    const fetchAccountLiveAuctions = async (address) => {
        try {
            let res = await query({
                cadence: GET_AUCTION_IDS,
                args: (arg, t) => [arg(address, t.Address)]
            })
            let data = await fetchAuctionData(address, res)
            return data
        } catch(err) {
            console.log(err)
        }
    }

    

    

    const addToAuction = async (nftid, price) => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await mutate({
                cadence: CREATE_AUCTION,
                args: (arg, t) => [
                    arg(nftid, t.UInt64),
                    arg(price, t.UFix64)
                ],
                limit: 9999
            })
            let txStatus = await tx(res).onceSealed()
            dispatch({ type: 'TX_SUCCESS', payload: txStatus })
            return txStatus
        } catch(err) {
            dispatch({ type: 'ERROR' })
        }
    }

    const bidOnAuction = async (nftid, address, price) => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await mutate({
                cadence: BID_ON_AUCTION,
                args: (arg, t) => [arg(nftid, t.UInt64), arg(address, t.Address), arg(price, t.UFix64)],
                limit: 9999
            })
            let txStatus = await tx(res).onceSealed()
            console.log(txStatus)
            dispatch({ type: 'TX_SUCCESS', payload: txStatus })
        } catch(err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    const settleAuction = async (nftid) => {
        console.log(state.error)
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await mutate({
                cadence: SETTLE_AUCTION,
                args: (arg, t) => [arg(nftid, t.UInt64)],
                limit: 9999
            })
            let txStatus = await tx(res).onceSealed()
            console.log(txStatus)
            dispatch({ type: 'TX_SUCCESS', payload: txStatus })
            return txStatus
        } catch(err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    const mintNsft = async (cid, fileType, title, description, editionSize) => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await mutate({
                cadence: MINT_NSFT,
                args: (arg, t) => [
                    arg(user?.addr, t.Address),
                    arg(cid, t.String),
                    arg(fileType, t.UInt8),
                    arg(title, t.String),
                    arg(description, t.String),
                    arg(editionSize, t.UInt16),
                  ],
                  limit: 9999,
            })
            //addTx(res)
            let txStatus = await tx(res).onceSealed()
            dispatch({ type: 'TX_SUCCESS', payload: txStatus })
            return txStatus
        } catch(err) {
            console.log(err)
            dispatch({ type: 'ERROR', payload: err })
        }
    }

    return {
        ...state,
        mintNsft,
        addToAuction,
        settleAuction,
        fetchAccountLiveAuctions,
        fetchUserMintedNsfts,
        fetchUserOwnedNsfts,
        fetchUserOwnedIds,
        bidOnAuction
    }
}