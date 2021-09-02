import React from "react";
import cn from "classnames";
import styles from "./Accept.module.sass";
import { useUser } from "../../../../providers/UserProvider";
import { useLocation } from "react-router";
import Loader from "../../../../components/Loader";



const Accept = ({ className, data, profile }) => {
  const items = [
    {
      title: "Platform fee",
      value: "20%",
    },
    {
      title: "You Recieve",
      value: `$${data.price * 0.8}`,
    },
  ];

  const { settleAuction, loading, status, error } = useUser()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nftid = location.pathname.split("/")[3];
    console.log(nftid)
    await settleAuction(parseInt(nftid));
  };

  return (
    <div className={cn(className, styles.accept)}>
      <div className={styles.line}>
        <div className={styles.icon}></div>
        <div className={styles.text}>
          You are about to accept a bid for <strong>{data.title}</strong> from{" "}
          <strong>{profile.name} (@{profile.handle})</strong>
        </div>
      </div>
      <div className={styles.stage}>${data.price.split('.')[0]}</div>
      <div className={styles.table}>
        {items.map((x, index) => (
          <div className={styles.row} key={index}>
            <div className={styles.col}>{x.title}</div>
            <div className={styles.col}>{x.value}</div>
          </div>
        ))}
      </div>
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
          <button className={cn("button done", styles.button)}>Success! Your auction has been settled</button>
        </div>
        ) : (      <div className={styles.btns}>
          <button className={cn("button", styles.button)} onClick={handleSubmit}>Accept bid</button>
        </div>
      )
      ))}
      </div>
  );
};

export default Accept;
