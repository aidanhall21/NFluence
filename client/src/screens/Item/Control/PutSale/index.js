import React, { useState } from "react";
import cn from "classnames";
import styles from "./PutSale.module.sass";
import Form from "../../../../components/Form";
import { useUser } from "../../../../providers/UserProvider";
import { useLocation, useParams } from "react-router";
import Loader from "../../../../components/Loader";
import { formatAmountInput } from "../../../../mocks/functions";
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

const PutSale = ({ className }) => {
  const [price, setPrice] = useState(false);
  const { addToAuction, loading, status, error } = useUser();
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
      {/*<div className={styles.line}>
        <div className={styles.icon}>
          <Icon name="coin" size="24" />
        </div>
        <div className={styles.details}>
          <div className={styles.info}>Instant sale price</div>
          <div className={styles.text}>
            Enter the price for which the item will be instanly sold
          </div>
        </div>
        <Switch className={styles.switch} value={price} setValue={setPrice} />
  </div>*/}
      <div className={styles.table}>
        <div className={styles.row}>
          <Form
            className={styles.form}
            onSubmit={() => handleSubmit()}
            value={price}
            placeholder="Set Starting Price"
            setValue={setPrice}
            type="number"
            name="price"
            step={1}
          />
          {/*<div className={styles.col}>Starting Price</div>
            <div className={styles.col}>value</div>*/}
        </div>
      </div>
      {loading ? (
        <div className={styles.item}>
          {/*<div className={styles.head}>
            <div className={styles.icon}>
              <LoaderCircle className={styles.loader} />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Minting...</div>
              <div className={styles.text}>
                This may take up to a couple minutes to complete.
              </div>
            </div>
      </div>*/}
          <button className={cn("button loading", styles.button)}>
            <Loader className={styles.loader} color="white" />
          </button>
        </div>
      ) : (error ? (
        <div className={cn(styles.item, styles.error)}>
          {/*<div className={styles.head}>
            <div className={styles.details}>
              <div className={styles.text}>
              Something went wrong, please{" "}
              <a href="/#" target="_blank" rel="noopener noreferrer">
                try again
              </a>
              </div>
            </div>
      </div>*/}
          <button className={cn("button error", styles.button)}>Something went wrong :(</button>
        </div>
      ) :
        (status.status === 4 ? (
          <div className={cn(styles.item, styles.done)}>
          {/*<div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="upload-file" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Mint Successful!</div>
              <div className={styles.text}>Check your profile to see your NFT</div>
            </div>
        </div>*/}
          <button className={cn("button done", styles.button)}>Success! Your auction has started</button>
        </div>
        ) : (<div className={styles.btns}>
          <button
            className={cn("button", styles.button)}
            onClick={handleSubmit}
          >
            Start Auction
          </button>
          {/*<button className={cn("button-stroke", styles.button)} onClick={onClose} >
            Go Back
        </button>*/}
        </div>))
      )}
    </div>
  );
};

export default PutSale;
