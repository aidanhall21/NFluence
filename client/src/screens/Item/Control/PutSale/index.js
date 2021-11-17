import React, { useState } from "react";
import cn from "classnames";
import styles from "./PutSale.module.sass";
import Form from "../../../../components/Form";
import { useUser } from "../../../../providers/UserProvider";
import { useParams } from "react-router";
import Loader from "../../../../components/Loader";
import { formatAmountInput } from "../../../../mocks/functions";
import { getAuctionStartedEvents } from "../../../../flow/query-event.script.script"
import axios from "axios";
//import Icon from "../../../../components/Icon";
//import LoaderCircle from "../../../../components/LoaderCircle";
//import Icon from "../../../../components/Icon";
//import Switch from "../../../../components/Switch";

/*const items = [
  {
    title: "Enter your price",
    value: "ETH",
  },
  {
    title: "Service fee",
    value: "1.5%",
  },
  {
    title: "Total bid amount",
    value: "0 ETH",
  },
];*/

let api_node;
process.env.NODE_ENV === "production"
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE

const PutSale = ({ className }) => {
  const [price, setPrice] = useState(false);
  const { addToAuction, loading, status, error, user } = useUser();
  const { nftid } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addToAuction(parseInt(nftid), formatAmountInput(price));

  };

  return (
    <div className={cn(className, styles.sale)}>
      <div className={cn("h4", styles.title)}>Put your NFT up for Auction</div>
      <div className={styles.text}>
            You'll need to confirm the transaction in the next popup.
          </div>
      <div className={styles.table}>
        <div className={styles.row}>
          <Form
            className={styles.form}
            onSubmit={handleSubmit}
            value={price}
            placeholder="Set Starting Price"
            setValue={setPrice}
            type="number"
            name="price"
            step={1}
          />
        </div>
      </div>
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
          <button className={cn("button done", styles.button)}>Success! Your auction has started</button>
        </div>
        ) : (<div className={styles.btns}>
          <button
            className={cn("button", styles.button)}
            onClick={handleSubmit}
          >
            Start Auction
          </button>
        </div>))
      )}
    </div>
  );
};

export default PutSale;
