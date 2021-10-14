import React, { useState } from "react";
import cn from "classnames";
import styles from "./Bid.module.sass";
import Form from "../Form";
import { formatAmountInput } from "../../mocks/functions";
import { useParams } from "react-router";
import { useUser } from "../../providers/UserProvider";
import Loader from "../Loader";
import { getBidPlacedEvents } from "../../flow/query-event.script.script";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import Modal from "../Modal";

const promise = loadStripe(
  "pk_test_51JhdSpJoN02dbjVUt1SXae4LgPPPw6vsD6TlVnaPDNe2Aex3tTm81xihPLp9gnwfSDLDcKz43qsjulWSsP7uPdfg00FJvIdwbs"
);

/*
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
*/

let api_node;
process.env.NODE_ENV === "production"
  ? (api_node = "")
  : (api_node = process.env.REACT_APP_LOCAL_API_NODE);

const Bid = ({ className, data }) => {
  const [bid, setBid] = useState(data.minNextBid);
  console.log(bid);
  const [nofunds, setNofunds] = useState(false);
  const [visibleModalBid, setVisibleModalBid] = useState(false);

  const { address, nftid } = useParams();
  const { bidOnAuction, balance, loading, error, status, getBalance, user } =
    useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNofunds(false);
    if (balance < parseInt(bid)) {
      setNofunds(true);
      return;
    }
    await bidOnAuction(parseInt(nftid), address, formatAmountInput(bid));
    await getBalance();
    let events = await getBidPlacedEvents();
    console.log(events);
    let userBids = events.filter((event) => event.data.user === user?.addr);
    const userBidData = userBids[userBids.length - 1];
    console.log(userBidData);
    await axios.post(`${api_node}/api/v1/bid`, {
      blockheight: userBidData.blockHeight,
      blockid: userBidData.blockId,
      blocktime: userBidData.blockTimestamp,
      tokenid: userBidData.data.tokenID,
      biddinguser: userBidData.data.user,
      price: userBidData.data.bidPrice,
      auctionuser: address,
    });
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
            onSubmit={handleSubmit}
            value={bid}
            placeholder="Bid Amount"
            setValue={setBid}
            type="number"
            name="bid"
            step={1}
            min={parseInt(data.minNextBid)}
          />
        </div>
        <Elements stripe={promise}>
            <CheckoutForm bid={bid * 100} />
          </Elements>
      </div>
      <Modal
        visible={visibleModalBid}
        onClose={() => setVisibleModalBid(false)}
      >
        <div>
        </div>
      </Modal>
      <div className={styles.btns}>
        <button className={cn("button", styles.button)} onClick={() => setVisibleModalBid(true)}>
          Place a bid
        </button>
      </div>
    </div>
  );
};

export default Bid;
