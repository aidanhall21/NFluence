import { mutate, query, tx } from "@onflow/fcl";
import { useEffect, useReducer } from "react";
import { CHECK_COLLECTION } from '../flow/check-collection.script'
import { INIT_ACCOUNT } from "../flow/init-account.tx";
import { SETUP_FUSD_VAULT } from "../flow/setup-fusd-vault.tx";
import { defaultReducer } from "../reducer/defaultReducer";

export default function useCollection(user) {
    const [state, dispatch] = useReducer(defaultReducer, {
        loading: false,
        error: false,
        data: false
    })

    const checkCollection = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await query({
                cadence: CHECK_COLLECTION,
                args: (arg, t) => [arg(user?.addr, t.Address)]
            })
            dispatch({ type: 'SUCCESS', payload: res })
        } catch (err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    useEffect(() => {
        if(!user?.addr) return
        checkCollection()
        //eslint-disable-next-line
    }, [user])

    const createCollection = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await mutate({
                cadence: INIT_ACCOUNT,
                limit: 9999
            })
            let txStatus = await tx(res).onceSealed()
            dispatch({ type: 'SUCCESS', payload: true })
            return txStatus
        } catch (err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    const createFUSDVault = async () => {
        dispatch({ type: 'PROCESSING' })
        try {
            let res = await mutate({
                cadence: SETUP_FUSD_VAULT,
                limit: 9999
            })
            let txStatus = await tx(res).onceSealed()
            dispatch({ type: 'SUCCESS', payload: true})
            return txStatus
        } catch(err) {
            console.log(err)
            dispatch({ type: 'ERROR' })
        }
    }

    return {
        ...state,
        checkCollection,
        createCollection,
        createFUSDVault,
    }
}