import React, { useEffect, useReducer, useState } from "react";
import cn from "classnames";
import styles from "./Item.module.sass";
import Users from "./Users";
import Control from "./Control";
//import Options from "./Options";
import { useParams } from "react-router";
import { defaultReducer } from "../../reducer/defaultReducer";
import { query } from "@onflow/fcl";
//import { useUser } from "../../providers/UserProvider";
import { GET_SINGLE_TOKEN_DATA } from "../../flow/get-single-token-data.script";
import { createTokenLink } from "../../mocks/functions";
import { ownerReducer } from "../../reducer/ownerReducer";
import axios from "axios";
import { GET_SINGLE_AUCTION_DATA } from "../../flow/get-single-auction-data.script";
import { GET_BID_HISTORY } from "../../flow/get-bid-history.script";
import Bids from "./Bids";
import { AuctionTimer } from "../../components/Card";
import ReactPlayer from "react-player"
import { useUser } from "../../providers/UserProvider";

const navLinks = ["Owners", "Info", "History", "Bids"];

/*
const categories = [
  {
    category: "black",
    content: "art",
  },
  {
    category: "purple",
    content: "unlockable",
  },
];
*/

//let users;

let api_node;
process.env.NODE_ENV === "production"
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE


const Item = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer(defaultReducer, {
    loading: false,
    error: false,
    data: {},
  });
  const [ownerState, dispatchState] = useReducer(ownerReducer, {
    loading: false,
    error: false,
    data: []
  })
  const [link, setLink] = useState('');
  const [currentOwner, setCurrentOwner] = useState(false)
  const { address, nftid } = useParams();
  const { user, owned_ids } = useUser()
  console.log(currentOwner)
  console.log(owned_ids)
  console.log(user?.addr)

  useEffect(() => {
    const fetchTokenData = async () => {
      dispatch({ type: "PROCESSING" });
      let acct;
      currentOwner ? acct = user?.addr : acct = address
      console.log(acct)
      try {
        let res = await query({
          cadence: GET_SINGLE_TOKEN_DATA,
          args: (arg, t) => [arg(acct, t.Address), arg(parseInt(nftid), t.UInt64)],
        });
        dispatch({ type: "SUCCESS", payload: res });
      } catch (err) {
        dispatch({ type: "ERROR" });
        throw new Error('whoops!')
      }
    };
    const fetchAuctionTokenData = async () => {
      dispatch({ type: 'PROCESSING' })
      try {
        let res = await query({
          cadence: GET_SINGLE_AUCTION_DATA,
          args: (arg, t) => [arg(address, t.Address), arg(parseInt(nftid), t.UInt64)]
        })
        const { nftData } = res
        const obj = {...res, ...nftData}
        dispatch({ type: 'SUCCESS', payload: obj }) 
      } catch(err) {
        dispatch({ type: 'ERROR' })
      }
    }
    const fetchBidHistory = async () => {
      try {
        let res = await query({
          cadence: GET_BID_HISTORY,
          args: (arg, t) => [arg(address, t.Address), arg(parseInt(nftid), t.UInt64)]
        })
        if (res.length > 0) {
          
        }
        setBids(res.reverse())
      } catch(err) {
      }
    }

      fetchTokenData()
      .catch((err) => {
        console.log('first catch')
        fetchAuctionTokenData()
        fetchBidHistory()
      })
  }, [address, nftid, currentOwner, user?.addr]);

  useEffect(() => {
    if (owned_ids.includes(parseInt(nftid))) {
      setCurrentOwner(true)
    }
  }, [nftid, owned_ids])

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      if (state.data.auctionId && user?.addr !== address && !currentOwner) return
      console.log('fetching')
      const res = await createTokenLink(state.data);
      console.log(res)
      if (!res.properties && !res.image) return
      setLink(res.properties.file)
    };
    fetchData();
    setLoading(false)
  }, [state.data, address, user?.addr, currentOwner])

  useEffect(() => {
    const fetchOwnerData = async () => {
      console.log(state.data)
      if (state.data === {}) return
      let acct;
      currentOwner ? acct = user?.addr : acct = address
      dispatchState({ type: 'PROCESSING' })
      try {
        const api = await axios.get(`${api_node}/api/v1/user/${acct}`)
        const serverResponse = api.data
        dispatchState({ type: 'OWNER', payload: {...serverResponse[0], position: 'Owner'} })
      } catch(err) {
        dispatchState({ type: 'ERROR' })
      }
    }
    const fetchCreatorData = async () => {
      if (state.data === {}) return
      dispatchState({ type: 'PROCESSING' })
      try {
        const api = await axios.get(`${api_node}/api/v1/user/${state.data.creatorAddress}`)
        const serverResponse = api.data
        if (serverResponse.length === 0) return
        dispatchState({ type: 'CREATOR', payload: {...serverResponse[0], position: 'Creator'} })
      } catch(err) {
        dispatchState({ type: 'ERROR' })
      }
    }
    fetchCreatorData()
    fetchOwnerData()
  }, [state.data, address, currentOwner, user?.addr])

  console.log('ITEMS', ownerState.data)

  return (
    <>
      <div className={cn("section", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.bg}>
            <div className={styles.preview}>
              {/*<div className={styles.categories}>
                {categories.map((x, index) => (
                  <div
                    className={cn(
                      { "status-black": x.category === "black" },
                      { "status-purple": x.category === "purple" },
                      styles.category
                    )}
                    key={index}
                  >
                    {x.content}
                  </div>
                ))}
                    </div>*/}
                    
              {state.data.fileType === 1 && link !== '' && !loading ? (
                <>
                  <ReactPlayer url={link} controls loop={true} />
                </>
              ) : (
                <>
                  <img src={link !== '' && !loading ? link : '/images/auction-lock.jpeg'} alt="Card" />
                </>
              )}
            </div>
            {/*<Options className={styles.options} />*/}
          </div>
          <div className={styles.details}>
            <h1 className={cn("h3", styles.title)}>{state.data.title}</h1>
            <div className={styles.cost}>
              {state.data.auctionId ? (<div className={cn("status-stroke-green", styles.price)}>
                Current Price: ${state.data.price.split(".")[0]}
              </div>) : (<></>)}
              <div className={styles.counter}>
                #{state.data.serial} of {state.data.editionSize}
              </div>
            </div>
            <div className={styles.info}>{state.data.description}</div>
            <div className={styles.nav}>
              {navLinks.map((x, index) => (
                <button
                  className={cn(
                    { [styles.active]: index === activeIndex },
                    styles.link
                  )}
                  onClick={() => setActiveIndex(index)}
                  key={index}
                >
                  {x}
                </button>
              ))}
            </div>
            {state.data.auctionId && activeIndex === 1 && (<AuctionTimer data={state.data} />)}
            {activeIndex === 0 && !state.error && (<Users className={styles.users} items={ownerState.data} />)}
            {activeIndex === 3 && (<Bids className={styles.users} items={bids} />)}
            <Control className={styles.control} data={state.data} error={state.error} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
