import { mutate, query, tx } from "@onflow/fcl";
import { useEffect, useReducer } from "react";
import { INIT_ACCOUNT } from "../flow/init-account.tx";
import { GET_BALANCE } from "../flow/get-balance.script";
import { defaultReducer } from "../reducer/defaultReducer";

export default function useCurrency(user) {
    const [state, dispatch] = useReducer(defaultReducer, {
        loading: true,
        error: false,
        data: '0.00000000'
    })

    useEffect(() => {
        getBalance();
        //eslint-disable-next-line
    }, [user?.addr])

    const getBalance = async () => {
        dispatch({ type: 'PROCESSING'})
        try {
            let response = await query({
                cadence: GET_BALANCE,
                args: (arg, t) => [arg(user?.addr, t.Address)]
            })
            dispatch({ type: 'SUCCESS', payload: response })
        } catch (err) {
            dispatch({ type: 'ERROR' })
        }
    }

    const createVault = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let response = await mutate({
                cadence: INIT_ACCOUNT,
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