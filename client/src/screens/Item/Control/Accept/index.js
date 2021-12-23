import React from "react";
import cn from "classnames";
import styles from "./Accept.module.sass";
import { useUser } from "../../../../providers/UserProvider";
import { useLocation } from "react-router";
import Loader from "../../../../components/Loader";
import axios from "axios";
import { Link } from "react-router-dom";

let api_node;
process.env.NODE_ENV === "production"
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE


const Accept = ({ className, data, profile }) => {
  const items = [
    {
      title: "Platform fee",
      value: "20%",
    },
    {
      title: "You Recieve",
      value: `$${(data.price * 0.8).toFixed(2)}`,
    },
  ];

  const { settleAuction, loading, status, error, getBalance, user, fetchAccountLiveAuctions, fetchUserMintedNsfts } = useUser()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nftid = location.pathname.split("/")[3];
    await settleAuction(parseInt(nftid));
    // When you settle but reject the transaction the auciton is still marked as inactive in the db
    await getBalance()
    await axios.put(`${api_node}/api/v1/auction/settle`, {
      active: false, 
      address: user?.addr, 
      tokenid: nftid, 
    })
    await fetchAccountLiveAuctions()
    await fetchUserMintedNsfts()
  };

  return (
    <div className={cn(className, styles.accept)}>
      <div className={styles.line}>
        <div className={styles.icon}></div>
        {data.numBids > 0 ? <div className={styles.text}>
          You are about to accept a bid for <strong>{data.title}</strong> from{" "}
          <strong>{profile.name} (@{profile.handle})</strong>
        </div> :
        <div className={styles.text}>
        You are about to end the auction with no bids.
      </div>}
      </div>
      {data.numBids > 0 ? <div className={styles.text}>
            You'll need to confirm the transaction in the next popup.
          </div> :
          <div className={styles.text}>
          Your item will be returned to you. You'll need to confirm the transaction in the next popup.
        </div>}
      {data.numBids > 0 && (<><div className={styles.stage}>${data.price.split('.')[0]}</div>
      <div className={styles.table}>
        {items.map((x, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            <div className={styles.col}>{x.value}</div>
          </div>
        ))}
      </div></>)}
      {loading ? (
        <div className={styles.btns}>
          <button className={cn("button loading", styles.button)}>
            <Loader className={styles.loader} color="white" />
          </button>
        </div>
      ) : (error ? (
        <div className={cn(styles.btns, styles.error)}>
          <button className={cn("button error", styles.button)}>Something went wrong :(</button>
        </div>
      ) :
        (status.status === 4 ? (
          <div className={cn(styles.btns, styles.done)}>
            <Link to={`/profile/${profile.handle}`}>
          <button className={cn("button done", styles.button)}>Success! Your auction has been settled</button>
          </Link>
        </div>
        ) : (      <div className={styles.btns}>
          <button className={cn("button", styles.button)} onClick={handleSubmit}>{data.numBids > 0 ? "Accept bid" : "End auction early"}</button>
        </div>
      )
      ))}
      </div>
  );
};

export default Accept;
