import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Card.module.sass";
//import Icon from "../Icon";
import { createTokenLink } from "../../mocks/functions";

export function AuctionTimer({ data }) {
  const calculateTimeLeft = () => {
    let timeRemaining = data.endTime * 1000 - Date.now();

    let timeLeft = {};

    if (timeRemaining > 0) {
      timeLeft = {
        days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeRemaining / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((timeRemaining / 1000 / 60) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 60000);
    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div className={styles.status}>
      Time Remaining:{" "}
      {timerComponents.length ? timerComponents : <span>00:00:00</span>}
    </div>
  );
}

const Card = ({ className, item }) => {
  //const [visible, setVisible] = useState(false);
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await createTokenLink(item);
      setMetadata(res);
    };
    fetchData();
  }, [item]);

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.preview}>
        {item.fileType === 1 ? (
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
        {/*<div className={styles.control}>
          <div
            className={cn(
              { "status-green": item.category === "green" },
              styles.category
            )}
          >
            {item.categoryText}
          </div>
          <button
            className={cn(styles.favorite, { [styles.active]: visible })}
            onClick={() => setVisible(!visible)}
          >
            <Icon name="heart" size="20" />
            </button>
          <button className={cn("button-small", styles.button)}>
            <span>Start Auction</span>
            <Icon name="scatter-up" size="16" />
          </button>
        </div>*/}
      </div>
      <Link
        className={styles.link}
        to={item.auctionId ? {
          pathname: `/auction/${item.creatorAddress}/${item.nftId}`
        } : {
          pathname: `/item/${item.creatorAddress}/${item.nftId}`
        }}
      >
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{item.title}</div>
            {item.auctionId ? (
              <div className={styles.price}>${item.price.split(".")[0]}</div>
            ) : (
              <></>
            )}
          </div>
          <div className={styles.line}>
            <div className={styles.users}>{item.description}</div>
            <div className={styles.counter}>
              # {item.serial}/{item.editionSize}
            </div>
          </div>
        </div>
      </Link>
      {item.auctionId ? <div className={styles.foot}>
        <AuctionTimer data={item} />
      </div> : <></>}
    </div>
  );
};

export default Card;
