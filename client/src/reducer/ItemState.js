import { createContext, useContext, useReducer } from "react";
import { object, func } from "prop-types";


const ItemContext = createContext()

export function ItemStateProvider({ reducer, initialState = {}, children }) {
    const value = useReducer(reducer, initialState)

    return (
        <ItemContext.Provider value={value}>
            {children}
        </ItemContext.Provider>
    )
}

ItemStateProvider.propTypes = {
    reducer: func,
    initialState: object
}

export function useItemState() {
    return useContext(ItemContext)
}