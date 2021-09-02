import React, { useState } from "react";
import cn from "classnames";
import styles from "./Bid.module.sass";
import Form from "../Form";
import { formatAmountInput } from "../../mocks/functions";
import { useParams } from "react-router";
import { useUser } from "../../providers/UserProvider";
import Loader from "../Loader";

const items = [
  {
    title: "Enter bid",
    value: "ETH",
  },
  {
    title: "Your balance",
    value: "8.498 ETH",
  },
  {
    title: "Service fee",
    value: "0 ETH",
  },
  {
    title: "Total bid amount",
    value: "0 ETH",
  },
];

const Bid = ({ className, data }) => {
  const [bid, setBid] = useState(false)
  const [nofunds, setNofunds] = useState(false)

  const { address, nftid } = useParams()
  const { bidOnAuction, balance, loading, error, status } = useUser()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNofunds(false)
    if (balance < parseInt(bid)) {
      setNofunds(true)
      return
    }
    await bidOnAuction(parseInt(nftid), address, formatAmountInput(bid));
  };

  return (
    <div className={cn(className, styles.checkout)}>
      <div className={cn("h4", styles.title)}>Place a bid</div>
      <div className={styles.info}>
        You are about to bid on <strong>{data.title}</strong>
      </div>
      <div className={styles.text}>
            Minimum bid ${parseInt(data.minNextBid).toString()}
          </div>
      <div className={styles.table}>
        <div className={styles.row}>
          <Form
            className={styles.form}
            onSubmit={() => handleSubmit()}
            value={bid}
            placeholder="Bid Amount"
            setValue={setBid}
            type="number"
            name="bid"
            step={1}
            min={parseInt(data.minNextBid)}
          />
          {/*<div className={styles.col}>Starting Price</div>
            <div className={styles.col}>value</div>*/}
        </div>
      </div>
          {nofunds && (<div className={styles.text}>
            You do not have the funds available to submit this bid
          </div>)}
      {/*<div className={styles.table}>
        {items.map((x, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            <div className={styles.col}>{x.value}</div>
          </div>
        ))}
        </div>*/}
      {loading ? (
        <div className={styles.item}>
          <button className={cn("button loading", styles.button)}>
            <Loader className={styles.loader} color="white" />
          </button>
        </div>
      ) : (error ? (
        <div className={cn(styles.item, styles.error)}>
          <button className={cn("button error", styles.button)}>Something went wrong :(</button>
        </div>
      ) :
        (status.status === 4 ? (
          <div className={cn(styles.item, styles.done)}>
          <button className={cn("button done", styles.button)}>Success! Your bid has been submitted</button>
        </div>
        ) : (<div className={styles.btns}>
          <button
            className={cn("button", styles.button)}
            onClick={handleSubmit}
          >
            Place a bid
          </button>
        </div>))
      )}
    </div>
  );
};

export default Bid;
