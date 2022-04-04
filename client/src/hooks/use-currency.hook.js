import { mutate, query, tx } from "@onflow/fcl";
import { useEffect, useReducer } from "react";
import { defaultReducer } from "../reducer/defaultReducer";
import { GET_FUSD_BALANCE } from "../flow/get-fusd-balance.script";
import { SETUP_FUSD_VAULT } from "../flow/setup-fusd-vault.tx";

export default function useCurrency(user) {
    const [state, dispatch] = useReducer(defaultReducer, {
        loading: true,
        error: false,
        data: '0.00000000'
    })

    useEffect(() => {
        if (!user) return
        getBalance();
        //eslint-disable-next-line
    }, [user?.addr])

    const getBalance = async () => {
        dispatch({ type: 'PROCESSING'})
        try {
            let response = await query({
                cadence: GET_FUSD_BALANCE,
                args: (arg, t) => [arg(user?.addr, t.Address)]
            })
            dispatch({ type: 'SUCCESS', payload: response })
        } catch (err) {
            console.log('user has no FUSD vault installed')
            dispatch({ type: 'ERROR' })
        }
    }

    const createVault = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let response = await mutate({
                cadence: SETUP_FUSD_VAULT,
            })
            await tx(response).onceSealed()
            dispatch({ type: 'SUCCESS' })
        } catch (err) {
            dispatch({ type: 'ERROR' })
            console.log(err)
        }
    }

    return {
        ...state,
        createVault,
        getBalance
    }
}