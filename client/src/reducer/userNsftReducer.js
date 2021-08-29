export const userNsftReducer = (state, action) => {
    switch (action.type) {
        case 'PROCESSING':
            return {
                ...state,
                loading: true,
                error: false
            }
        case 'MINTED_SUCCESS':
            return {
                ...state,
                loading: false,
                error: false,
                minted_data: action.payload
            }
        case 'AUCTION_SUCCESS':
            return {
                ...state,
                loading: false,
                error: false,
                auction_data: action.payload
            }
        case 'TX_SUCCESS':
            return {
                ...state,
                loading: false,
                error: false,
                txStatus: action.payload
            }
        case 'ERROR':
            return {
                ...state,
                loading: false,
                error: true
            }
        default:
            throw new Error()
    }
}