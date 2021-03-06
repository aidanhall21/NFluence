import { useEffect, useReducer } from "react";
import { defaultReducer } from "../reducer/defaultReducer";
import Identicon from "identicon.js";
import axios from "axios";

let api_node;
process.env.NODE_ENV === "production"
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE

export default function useProfileData(user, loggedIn) {
    const [state, dispatch] = useReducer(defaultReducer, {
        loading: false,
        error: false,
        data: {
            avatar: '',
            name: 'new_user',
            handle: user?.addr,
            cover_image: false,
            profile_image: false,
            address: user?.addr,
            email: '',
            verified: false,
            bio: '',
            url: null,
            twitter: null,
            instagram: null,
            db: false
          }
      })

      const fetchUserData = async () => {
        dispatch({ type: 'PROCESSING' })
        let hash;
        !loggedIn ? hash = '0x0000000000000' : hash = user?.addr
        let avatar = new Identicon(hash).toString()
        try {
          const api = await axios.get(`${api_node}/api/v1/user/${user?.addr}`)
          const serverResponse = api.data;
          if (serverResponse.length > 0) {
            dispatch({ type: 'SUCCESS', payload: serverResponse[0] })
          } else {
            dispatch({ type: 'SUCCESS', payload: {
              avatar: avatar,
              name: 'new_user',
              handle: user?.addr,
              cover_image: false,
              profile_image: false,
              address: user?.addr,
              email: '',
              bio: '',
              verified: false,
              url: null,
              twitter: null,
              instagram: null,
              db: false
            }})
          }
        } catch(err) {
          dispatch({ type: 'ERROR' })
        }
      }



      useEffect(() => {
        if (!user?.addr) return
        fetchUserData()
        //eslint-disable-next-line
      }, [user?.addr])

    return {
        ...state,
        fetchUserData
    }
}