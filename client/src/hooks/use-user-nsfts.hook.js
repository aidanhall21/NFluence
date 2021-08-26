import { useEffect, useReducer } from "react";
import { userNsftReducer } from "../reducer/userNsftReducer";
import { mutate, query, tx } from '@onflow/fcl';
import { MINT_NSFT } from "../flow/mint-nsft.tx";
import { authorizationFunction } from "../services/authorization-function";
import { GET_TOKEN_DATA } from "../flow/get-token-data.script";

export default function useUserNsfts(user, collection) {
    const [state, dispatch] = useReducer(userNsftReducer, {
        loading: false,
        error: false,
        data: []
    })

    //const { addTx } = useTxs()
    //const { checkCollection } = useCollection()

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
                dispatch({ type: 'SUCCESS', payload: minted_nsfts })
            } catch (err) {
                console.log(err)
                dispatch({ type: 'ERROR' })
            }
        }
        fetchUserMintedNsfts()
        //eslint-disable-next-line
    }, [user])

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
            dispatch({ type: 'SUCCESS', payload: txStatus })
            return txStatus
        } catch(err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    return {
        ...state,
        mintNsft
    }
}