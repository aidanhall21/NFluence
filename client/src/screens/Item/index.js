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
  const { address, nftid } = useParams();
  const { user } = useUser()
  console.log(bids)

  useEffect(() => {
    const fetchTokenData = async () => {
      dispatch({ type: "PROCESSING" });
      try {
        let res = await query({
          cadence: GET_SINGLE_TOKEN_DATA,
          args: (arg, t) => [arg(address, t.Address), arg(parseInt(nftid), t.UInt64)],
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
        setBids(res)
      } catch(err) {
      }
    }

      fetchTokenData()
      .catch((err) => {
        fetchAuctionTokenData()
        fetchBidHistory()
      })
    //eslint-disable-next-line
  }, [address, nftid]);

  useEffect(() => {
    const fetchData = async () => {
      if (state.data.auctionId && user?.addr !== address) return
      const res = await createTokenLink(state.data);
      if (!res.properties && !res.image) return
      res.properties ? setLink(res.properties.file) : setLink(res.image)
    };
    fetchData();
  }, [state.data, address, user?.addr])

  useEffect(() => {
    const fetchOwnerData = async () => {
      dispatchState({ type: 'PROCESSING' })
      try {
        const api = await axios.get(`${api_node}/api/v1/user/${address}`)
        const serverResponse = api.data
        dispatchState({ type: 'OWNER', payload: {...serverResponse[0], position: 'Owner'} })
      } catch(err) {
        dispatchState({ type: 'ERROR' })
      }
    }
    fetchOwnerData()
  }, [address])

  useEffect(() => {
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
  }, [state.data])


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
                    
              {state.data.fileType === 1 && link !== '' ? (
                <>
                  <ReactPlayer url={link} controls loop={true} />
                </>
              ) : (
                <>
                  <img src={link === '' ? '/images/auction-lock.jpeg' : link} alt="Card" />
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
            {activeIndex === 0 && (<Users className={styles.users} items={ownerState.data} />)}
            {activeIndex === 3 && (<Bids className={styles.users} items={bids} />)}
            <Control className={styles.control} data={state.data} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
