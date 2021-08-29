import React, { useEffect, useReducer, useState } from "react";
import cn from "classnames";
import styles from "./Item.module.sass";
import Users from "./Users";
import Control from "./Control";
//import Options from "./Options";
import { useLocation, useParams } from "react-router";
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

const navLinks = ["Info", "Owners", "History", "Bids"];

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
  const [metadata, setMetadata] = useState({});
  const { address, nftid } = useParams();
  const location = useLocation()

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
        console.log(err);
        dispatch({ type: "ERROR" });
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
        console.log(err)
        dispatch({ type: 'ERROR' })
      }
    }
    if (location.pathname.split('/')[1] === 'auction') {
      fetchAuctionTokenData()
    } else {
      fetchTokenData();
    }
    //eslint-disable-next-line
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname.split('/')[1] === 'item') return
    const fetchBidHistory = async () => {
      try {
        let res = await query({
          cadence: GET_BID_HISTORY,
          args: (arg, t) => [arg(address, t.Address), arg(parseInt(nftid), t.UInt64)]
        })
        setBids(res)
      } catch(err) {
        console.log(err)
      }
    }
    fetchBidHistory()
    //eslint-disable-next-line
  }, [location.pathname])

  useEffect(() => {
    const fetchData = async () => {
      const res = await createTokenLink(state.data);
      setMetadata(res);
    };
    fetchData();
  }, [state.data])

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
              {state.data.fileType === 1 ? (
                <>
                  <video controls>
                    <source src={metadata.image} type="video/mp4" />
                  </video>
                </>
              ) : (
                <>
                  <img src={metadata.image} alt="Card" />
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
            {activeIndex === 0 && (<AuctionTimer data={state.data} />)}
            {activeIndex === 1 && (<Users className={styles.users} items={ownerState.data} />)}
            {activeIndex === 3 && (<Bids className={styles.users} items={bids} />)}
            <Control className={styles.control} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
