import { useEffect, useReducer } from "react";
import { userNsftReducer } from "../reducer/userNsftReducer";
import { mutate, query, tx } from '@onflow/fcl';
//import { useTxs } from "../providers/TxProvider";
import { LIST_USER_OWNED_NFTS } from "../flow/list-user-minted-nft.script";
import { MINT_NSFT } from "../flow/mint-nsft.tx";
import { authorizationFunction } from "../services/authorization-function";

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
                    cadence: LIST_USER_OWNED_NFTS,
                    args: (arg, t) => [arg(user?.addr, t.Address)]
                })
                console.log(res)
                let minted_nsfts = res.filter(token => token.creatorAddress === user?.addr)
                dispatch({ type: 'SUCCESS', payload: minted_nsfts })
            } catch (err) {
                console.log(err)
                dispatch({ type: 'ERROR' })
            }
        }
        console.log('fetching!!')
        fetchUserMintedNsfts()
        //eslint-disable-next-line
    }, [user])

    const mintNsft = async (cid, fileType, title, description, editionSize) => {
        dispatch({ type: 'PROCESSING' })
        console.log(state.loading)
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
            console.log(state.loading)
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