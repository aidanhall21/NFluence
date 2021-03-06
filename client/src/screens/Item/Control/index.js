import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./Control.module.sass";
import Bid from "../../../components/Bid";
import Accept from "./Accept";
import PutSale from "./PutSale";
import Modal from "../../../components/Modal";
import { useLocation } from "react-router-dom";
import { query } from "@onflow/fcl";
import { GET_HIGHEST_BIDDER } from "../../../flow/get-highest-bidder.script";
import axios from "axios";
import { useUser } from "../../../providers/UserProvider";
import { Link } from "react-router-dom";

let api_node;
process.env.NODE_ENV === "production"
  ? (api_node = "")
  : (api_node = process.env.REACT_APP_LOCAL_API_NODE);

const Control = ({ className, data, error }) => {
  const [visibleModalBid, setVisibleModalBid] = useState(false);
  const [visibleModalAccept, setVisibleModalAccept] = useState(false);
  const [visibleModalSale, setVisibleModalSale] = useState(false);
  const [highBidder, setHighBidder] = useState("");
  const [highBidderProfile, setHighBidderProfile] = useState({});

  const { pathname } = useLocation();
  const address = pathname.split("/")[2];
  const tokenId = pathname.split("/")[3];

  const { user } = useUser();

  useEffect(() => {
    if (!'auctionId' in data) return;
    const getHighestBidder = async () => {
      try {
        let res = await query({
          cadence: GET_HIGHEST_BIDDER,
          args: (arg, t) => [
            arg(address, t.Address),
            arg(parseInt(tokenId), t.UInt64),
          ],
        });
        setHighBidder(res);
      } catch (err) {}
    };
    getHighestBidder();
  }, [data, address, tokenId]);

  useEffect(() => {
    if (highBidder === "") return;
    const getHighestBidderProfile = async () => {
      try {
        const api = await axios.get(`${api_node}/api/v1/user/${highBidder}`);
        const serverResponse = api.data;
        setHighBidderProfile(serverResponse[0]);
      } catch (err) {}
    };
    getHighestBidderProfile();
  }, [highBidder]);

  return (
    <>
      <div className={cn(styles.control, className)}>
        {'auctionId' in data && (
          <div className={styles.head}>
            <div className={styles.avatar}>
              {highBidderProfile.profile_image ? (
                <img
                  src={`https://nfluence-assets.s3.amazonaws.com/${highBidder}-profile`}
                  alt="Avatar"
                />
              ) : (
                <img
                  src={`data:image/png;base64,${highBidderProfile.avatar}`}
                  alt="Avatar"
                />
              )}
            </div>
            <div className={styles.details}>
              <div className={styles.info}>
                Highest bid by{" "}
                <Link to={`/profile/${highBidderProfile.handle}`}>
                  <span>@{highBidderProfile.handle}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
        {'auctionId' in data && (
          <div className={styles.btns}>
            {address === user?.addr && (
              <button
                className={cn("button", styles.button)}
                onClick={() => setVisibleModalAccept(true)}
              >
                Settle Auction
              </button>
            )}
            {address !== user?.addr && (
                <button
                  className={cn("button-stroke", styles.button)}
                  onClick={() => setVisibleModalBid(true)}
                >
                  Place a bid
                </button>
            )}
          </div>
        )}
        {!'auctionId' in data && address === user?.addr && !error && (
          <>
            <div className={styles.foot}>
              <button
                className={cn("button", styles.button)}
                onClick={() => setVisibleModalSale(true)}
              >
                Start Auction
              </button>
            </div>
            <div className={styles.note}>
              A platform fee of 20% will be taken from the final sale price of
              the item.
            </div>
          </>
        )}
      </div>
      <Modal
        visible={visibleModalBid}
        onClose={() => setVisibleModalBid(false)}
      >
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
