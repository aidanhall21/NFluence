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
  const [loading, setLoading] = useState(true)
  const { handle } = useParams();
  const { profile, user } = useUser()

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      if ('auctionId' in item && item.creatorAddress !== user?.addr) return
      const res = await createTokenLink(item);
      setLink(res.properties.file)
    };
    fetchData();
    setLoading(false)
  }, [item, handle, profile.handle, user?.addr]);

  return (
    <div className={cn(styles.card, className)}>
      <div className={styles.preview}>
        {item.fileType === 1 && link !== '' && !loading ? (
          <>
            <ReactPlayer url={link} width="100%" height="100%" />
          </>
        ) : (
          <>
            <img src={link !== '' && !loading ? link : '/images/auction-lock.jpg'} alt="Card" />
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
            {'auctionId' in item ? (
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
      {'auctionId' in item ? <div className={styles.foot}>
        <AuctionTimer data={item} />
      </div> : <></>}
    </div>
  );
};

export default Card;
