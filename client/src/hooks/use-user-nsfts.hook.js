import { useEffect, useReducer } from "react";
import { userNsftReducer } from "../reducer/userNsftReducer";
import { mutate, query, tx } from '@onflow/fcl';
import { MINT_NSFT } from "../flow/mint-nsft.tx";
import { authorizationFunction } from "../services/authorization-function";
import { GET_TOKEN_DATA } from "../flow/get-token-data.script";
import { CREATE_AUCTION } from "../flow/create-auction.tx";
import { GET_AUCTION_IDS } from "../flow/get-auction-ids.script";
import { GET_SINGLE_AUCTION_DATA } from "../flow/get-single-auction-data.script";
import { SETTLE_AUCTION } from "../flow/settle-auction.tx";
import { BID_ON_AUCTION } from "../flow/bid-auction.tx";

export default function useUserNsfts(user) {
    const [state, dispatch] = useReducer(userNsftReducer, {
        loading: false,
        error: false,
        minted_data: [],
        auction_data: [],
        txStatus: {}
    })

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
            dispatch({ type: 'MINTED_SUCCESS', payload: minted_nsfts })
        } catch (err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    useEffect(() => {
        if(!user?.addr) return
        fetchUserMintedNsfts()
        //eslint-disable-next-line
    }, [user])

    const runScript = async (address, id) => {
        let auction_data = await query({
            cadence: GET_SINGLE_AUCTION_DATA,
            args: (arg, t) => [arg(address, t.Address), arg(id, t.UInt64)]
        })
        const { nftData } = auction_data
        return {...auction_data, ...nftData}
    }

    const fetchAuctionData = async (address, data) => {
        return Promise.all(data.map((id) => {
            return runScript(address, id)
        }))
    }

    useEffect(() => {
        if(!user?.addr) return
        const fetchUserLiveAuctions = async () => {
            dispatch({ type: 'PROCESSING' })
            try {
                let res = await query({
                    cadence: GET_AUCTION_IDS,
                    args: (arg, t) => [arg(user?.addr, t.Address)]
                })
                let data = await fetchAuctionData(user?.addr, res)
                dispatch({ type: 'AUCTION_SUCCESS', payload: data })
            } catch(err) {
                dispatch({ type: 'ERROR' })
            }
        }
        fetchUserLiveAuctions()
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

    /*
    const fetchAccountLiveBids = async (address) => {
        try {
            let res = await query({

            })
        } catch(err) {
            console.log(err)
        }
    }
    */

    const addToAuction = async (nftid, price) => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await mutate({
                cadence: CREATE_AUCTION,
                args: (arg, t) => [
                    arg(nftid, t.UInt64),
                    arg(price, t.UFix64)
                ],
                limit: 500
            })
            let txStatus = await tx(res).onceSealed()
            dispatch({ type: 'TX_SUCCESS', payload: txStatus })
            return txStatus
        } catch(err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    const bidOnAuction = async (nftid, address, price) => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await mutate({
                cadence: BID_ON_AUCTION,
                args: (arg, t) => [arg(nftid, t.UInt64), arg(address, t.Address), arg(price, t.UFix64)],
                limit: 150
            })
            let txStatus = await tx(res).onceSealed()
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
                limit: 500
            })
            let txStatus = await tx(res).onceSealed()
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
                  limit: 500,
                  authz: authorizationFunction
            })
            //addTx(res)
            let txStatus = await tx(res).onceSealed()
            dispatch({ type: 'TX_SUCCESS', payload: txStatus })
            return txStatus
        } catch(err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    return {
        ...state,
        mintNsft,
        addToAuction,
        settleAuction,
        fetchAccountLiveAuctions,
        fetchUserMintedNsfts,
        bidOnAuction
    }
}