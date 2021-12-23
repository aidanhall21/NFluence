import React from "react";
import cn from "classnames";
import styles from "./Bids.module.sass";

const Bids = ({ className, items }) => {
  return (
    <div className={cn(styles.users, className)}>
      <div className={styles.list}>
        {items.map((x, index) => (
          <div className={styles.item} key={index}>
            <div className={styles.avatar}>
            <img src={`https://nfluence-assets.s3.amazonaws.com/${x.blockEventData.user}-profile`} onError={(e)=>{e.target.onerror = null; e.target.src="/logo-single-letter.jpeg"}} alt="Avatar" />
        </div>
            <div className={styles.details}>
              <div className={styles.name}>@{x.userData[0].handle}</div>
              <div className={styles.name}>${x.blockEventData.bidPrice}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bids;
