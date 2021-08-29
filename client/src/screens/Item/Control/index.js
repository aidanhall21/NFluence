import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Control.module.sass";
import Checkout from "./Checkout";
import Connect from "../../../components/Connect";
import Bid from "../../../components/Bid";
import Accept from "./Accept";
import PutSale from "./PutSale";
import SuccessfullyPurchased from "./SuccessfullyPurchased";
import Modal from "../../../components/Modal";
import { useLocation } from "react-router";
import { query } from "@onflow/fcl";
import { GET_HIGHEST_BIDDER } from "../../../flow/get-highest-bidder.script";
import axios from "axios";
import { useUser } from "../../../providers/UserProvider";

let api_node;
process.env.NODE_ENV === "production"
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE

const Control = ({ className }) => {
  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [highBidder, setHighBidder] = useState('')
  const [highBidderProfile, setHighBidderProfile] = useState({})

  const location = useLocation();
  const address = location.pathname.split("/")[2]
  const tokenId = location.pathname.split("/")[3]
  const page = location.pathname.split("/")[1]

  const { user } = useUser()

  useEffect(() => {
    if (page === 'item') return
    const getHighestBidder = async () => {
      try {
        let res = await query({
          cadence: GET_HIGHEST_BIDDER,
          args: (arg, t) => [arg(address, t.Address), arg(parseInt(tokenId), t.UInt64)]
        })
        setHighBidder(res)
      } catch(err) {
        console.log(err)
      }
    }
    getHighestBidder()
    //eslint-disable-next-line
  }, [location])

  useEffect(() => {
    if (highBidder === '') return
    const getHighestBidderProfile = async () => {
      try {
        const api = await axios.get(`${api_node}/api/v1/user/${highBidder}`)
        const serverResponse = api.data;
        setHighBidderProfile(serverResponse[0])
      } catch(err) {
        console.log(err)
      }
    }
    getHighestBidderProfile()
  }, [highBidder])

  return (
    <>
      <div className={cn(styles.control, className)}>
        <div className={styles.head}>
          <div className={styles.avatar}>
          {highBidderProfile.profile_image ? <img src={`/user-images/${highBidder}-profile.jpg`} alt="Avatar" /> : <img src={`data:image/png;base64,${highBidderProfile.avatar}`} alt="Avatar" />}
          </div>
          <div className={styles.details}>
            <div className={styles.info}>
              Highest bid by <span>@{highBidderProfile.handle}</span>
            </div>
            {/*<div className={styles.cost}>
              <div className={styles.price}>1.46 ETH</div>
              <div className={styles.price}>$2,764.89</div>
            </div>*/}
          </div>
        </div>
        <div className={styles.btns}>
          {address === user?.addr && page === 'auction' && (<button
            className={cn("button", styles.button)}
            onClick={() => setVisibleModalPurchase(true)}
          >
            Settle Auction
          </button>)}
          {address !== user?.addr && page === 'auction' && (<button
            className={cn("button-stroke", styles.button)}
            onClick={() => setVisibleModalBid(true)}
          >
            Place a bid
          </button>)}
        </div>
        {/*<div className={styles.btns}>
          <button className={cn("button-stroke", styles.button)}>
            View all
          </button>
          <button
            className={cn("button", styles.button)}
            onClick={() => setVisibleModalAccept(true)}
          >
            Accept
          </button>
          </div>
        <div className={styles.text}>
          Platform fee <span className={styles.percent}>20%</span>
          </div>*/}
        {page === 'item' && address === user?.addr && (<><div className={styles.foot}>
          <button
            className={cn("button", styles.button)}
            onClick={() => setVisibleModalSale(true)}
          >
            Start Auction
          </button>
        </div>
        <div className={styles.note}>
          A platform fee of 20% will be taken from the final sale price of the
          item.
        </div></>)}
      </div>
      <Modal
        visible={visibleModalPurchase}
        onClose={() => setVisibleModalPurchase(false)}
      >
        <Checkout />
        <SuccessfullyPurchased />
      </Modal>
      <Modal
        visible={visibleModalBid}
        onClose={() => setVisibleModalBid(false)}
      >
        <Connect />
        <Bid />
      </Modal>
      <Modal
        visible={visibleModalAccept}
        onClose={() => setVisibleModalAccept(false)}
      >
        <Accept />
      </Modal>
      <Modal
        visible={visibleModalSale}
        onClose={() => setVisibleModalSale(false)}
      >
        <PutSale />
      </Modal>
    </>
  );
};

export default Control;
