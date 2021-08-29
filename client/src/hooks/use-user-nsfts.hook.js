import { useEffect, useReducer } from "react";
import { userNsftReducer } from "../reducer/userNsftReducer";
import { mutate, query, tx } from '@onflow/fcl';
import { MINT_NSFT } from "../flow/mint-nsft.tx";
import { authorizationFunction } from "../services/authorization-function";
import { GET_TOKEN_DATA } from "../flow/get-token-data.script";
import { CREATE_AUCTION } from "../flow/create-auction.tx";
import { GET_AUCTION_IDS } from "../flow/get-auction-ids.script";
import { GET_SINGLE_AUCTION_DATA } from "../flow/get-single-auction-data.script";

export default function useUserNsfts(user) {
    const [state, dispatch] = useReducer(userNsftReducer, {
        loading: false,
        error: false,
        minted_data: [],
        auction_data: [],
        txStatus: {}
    })

    useEffect(() => {
        if(!user?.addr) return
        const fetchUserMintedNsfts = async () => {
            dispatch({ type: 'PROCESSING' })
            try {
                let res = await query({
                    cadence: GET_TOKEN_DATA,
                    args: (arg, t) => [arg(user?.addr, t.Address)]
                })
                let minted_nsfts = res.filter(token => token.creatorAddress === user?.addr)
                dispatch({ type: 'MINTED_SUCCESS', payload: minted_nsfts })
            } catch (err) {
                console.log(err)
                dispatch({ type: 'ERROR' })
            }
        }
        fetchUserMintedNsfts()
        //eslint-disable-next-line
    }, [user])

    useEffect(() => {
        if(!user?.addr) return
        const runScript = async id => {
            let auction_data = await query({
                cadence: GET_SINGLE_AUCTION_DATA,
                args: (arg, t) => [arg(user?.addr, t.Address), arg(id, t.UInt64)]
            })
            const { nftData } = auction_data
            return {...auction_data, ...nftData}
        }
        const fetchAuctionData = async (data) => {
            return Promise.all(data.map((id) => {
                return runScript(id)
            }))
        }
        const fetchUserLiveAuctions = async () => {
            dispatch({ type: 'PROCESSING' })
            try {
                let res = await query({
                    cadence: GET_AUCTION_IDS,
                    args: (arg, t) => [arg(user?.addr, t.Address)]
                })
                let data = await fetchAuctionData(res)
                dispatch({ type: 'AUCTION_SUCCESS', payload: data })
            } catch(err) {
                dispatch({ type: 'ERROR' })
            }
        }
        fetchUserLiveAuctions()
    }, [user])

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
        addToAuction
    }
}