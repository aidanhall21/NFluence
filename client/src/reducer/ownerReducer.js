export const ownerReducer = (state, action) => {
    switch (action.type) {
      case 'PROCESSING':
        return {
          ...state,
          loading: true,
          error: false
        }
      case 'OWNER':
        return {
          ...state,
          loading: false,
          error: false,
          data: [action.payload]
        }
      case 'CREATOR':
        return {
          ...state,
          loading: false,
          error: false,
          data: [...state.data, action.payload]
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