import React from "react";
import cn from "classnames";
import styles from "./Preview.module.sass";
import Icon from "../../../components/Icon";

const Preview = ({ className, onClose, obj }) => {
  return (
    <div className={cn(className, styles.wrap)}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>
          <Icon name="close" size="14" />
        </button>
        <div className={styles.info}>Preview</div>
        <div className={styles.card}>
          <div className={styles.preview}>
            <img
              src={obj.file ? obj.file : "/images/content/card-pic-6@2x.jpg"}
              alt="Card"
            />
          </div>
          <div className={styles.link}>
            <div className={styles.body}>
              
              <div className={styles.line}>
                
                <div className={styles.title}>{obj.name ? obj.name : "Title"}</div>
                <div className={styles.price}>$621</div>
              </div>
              <div className={styles.line}>
                <div className={styles.counter}>{obj.desc ? obj.desc : "Description"}</div>
              </div>
              
            </div>
            <div className={styles.foot}>
            <div className={styles.bid}>
                1 of 1
              </div>
              <div className={styles.status}>
                <Icon name="candlesticks-up" size="20" />
                Number of bids <span>9</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
