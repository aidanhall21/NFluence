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
import { Link } from "react-router-dom";

let api_node;
process.env.NODE_ENV === "production"
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE

const Control = ({ className, data, error }) => {
  const [visibleModalPurchase, setVisibleModalPurchase] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [highBidder, setHighBidder] = useState('')
  const [highBidderProfile, setHighBidderProfile] = useState({})

  const location = useLocation();
  const address = location.pathname.split("/")[2]
  const tokenId = location.pathname.split("/")[3]

  const { user } = useUser()

  useEffect(() => {
    if (!data.auctionId) return
    const getHighestBidder = async () => {
      try {
        let res = await query({
          cadence: GET_HIGHEST_BIDDER,
          args: (arg, t) => [arg(address, t.Address), arg(parseInt(tokenId), t.UInt64)]
        })
        setHighBidder(res)
      } catch(err) {
      }
    }
    getHighestBidder()
  }, [data])

  useEffect(() => {
    if (highBidder === '') return
    const getHighestBidderProfile = async () => {
      try {
        const api = await axios.get(`${api_node}/api/v1/user/${highBidder}`)
        const serverResponse = api.data;
        setHighBidderProfile(serverResponse[0])
      } catch(err) {
      }
    }
    getHighestBidderProfile()
  }, [highBidder])

  return (
    <>
      <div className={cn(styles.control, className)}>
        {data.auctionId && (<div className={styles.head}>
          <div className={styles.avatar}>
          {highBidderProfile.profile_image ? <img src={`/user-images/${highBidder}-profile.jpg`} alt="Avatar" /> : <img src={`data:image/png;base64,${highBidderProfile.avatar}`} alt="Avatar" />}
          </div>
          <div className={styles.details}>
            <div className={styles.info}>
              Highest bid by <Link to={`/profile/${highBidderProfile.handle}`}><span>@{highBidderProfile.handle}</span></Link>
            </div>
          </div>
        </div>)}
        {data.auctionId && (<div className={styles.btns}>
          {address === user?.addr && (<button
            className={cn("button", styles.button)}
            onClick={() => setVisibleModalAccept(true)}
          >
            Settle Auction
          </button>)}
          {address !== user?.addr && (<button
            className={cn("button-stroke", styles.button)}
            onClick={() => setVisibleModalBid(true)}
          >
            Place a bid
          </button>)}
        </div>)}
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
        {!data.auctionId && address === user?.addr && !error && (<><div className={styles.foot}>
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
      {/*<Modal
        visible={visibleModalPurchase}
        onClose={() => setVisibleModalPurchase(false)}
      >
        <Checkout />
        <SuccessfullyPurchased />
      </Modal>*/}
      <Modal
        visible={visibleModalBid}
        onClose={() => setVisibleModalBid(false)}
      >
        {/*<Connect />*/}
        <Bid data={data} />
      </Modal>
      <Modal
        visible={visibleModalAccept}
        onClose={() => setVisibleModalAccept(false)}
      >
        <Accept data={data} profile={highBidderProfile} />
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
