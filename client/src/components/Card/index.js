import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link, useParams } from "react-router-dom";
import styles from "./Card.module.sass";
//import Icon from "../Icon";
import { createTokenLink } from "../../mocks/functions";
import ReactPlayer from "react-player";
import { useUser } from "../../providers/UserProvider";

export function AuctionTimer({ data }) {
  const calculateTimeLeft = () => {
    let timeRemaining = data.endTime * 1000 - Date.now();

    let timeLeft = {};

    if (timeRemaining > 0) {
      timeLeft = {
        days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeRemaining / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((timeRemaining / 1000 / 60) % 60),
        seconds: Math.floor((timeRemaining / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
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
  const [link, setLink] = useState('');
  const { handle } = useParams();
  const { profile } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      if (item.auctionId && profile.handle !== handle) return
      const res = await createTokenLink(item);
      res.properties ? setLink(res.properties.file) : setLink(res.image)
    };
    fetchData();
  }, [item, handle, profile.handle]);

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.preview}>
        {item.fileType === 1 && link !== '' ? (
          <>
            <ReactPlayer url={link} width="100%" height="100%" />
          </>
        ) : (
          <>
            <img src={link === '' ? '/images/auction-lock.jpeg' : link} alt="Card" />
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
        to={`/item/${item.creatorAddress}/${item.nftId}`}
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
