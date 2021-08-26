import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Card.module.sass";
import Icon from "../Icon";

function makeGatewayURL(ipfsURI) {
  return ipfsURI.replace(/^ipfs:\/\//, "https://dweb.link/ipfs/");
}

async function fetchIPFSJSON(ipfsURI) {
  const url = makeGatewayURL(ipfsURI);
  const resp = await fetch(url);
  return resp.json();
}

const Card = ({ className, item }) => {
  const [visible, setVisible] = useState(false);
  const [metadata, setMetadata] = useState({});

  useEffect(() => {
    const createTokenLink = async () => {
      if (item.cid === "") return {};
      const renderedFile = await fetchIPFSJSON(item.cid);
      if (renderedFile.image) {
        renderedFile.image = makeGatewayURL(renderedFile.image);
      }
      return renderedFile;
    };
    const fetchData = async () => {
      const res = await createTokenLink();
      setMetadata(res)
    }
    fetchData()
  }, [item.cid]);

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
        <div className={styles.control}>
          {/*<div
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
            </button>*/}
          <button className={cn("button-small", styles.button)}>
            <span>Place a bid</span>
            <Icon name="scatter-up" size="16" />
          </button>
        </div>
      </div>
      <Link className={styles.link} to="/">
        <div className={styles.body}>
          <div className={styles.line}>
            <div className={styles.title}>{item.title}</div>
            {/*<div className={styles.price}>{item.price}</div>*/}
          </div>
          <div className={styles.line}>
          <div className={styles.users}>
              {item.description}
            </div>
            <div className={styles.counter}>/{item.editionSize}</div>
          </div>
        </div>
        {/*<div className={styles.foot}>
          <div className={styles.status}>
            <Icon name="candlesticks-up" size="20" />
            Highest bid <span>{item.highestBid}</span>
          </div>
          <div
            className={styles.bid}
            dangerouslySetInnerHTML={{ __html: item.bid }}
          />
          </div>*/}
      </Link>
    </div>
  );
};

export default Card;
