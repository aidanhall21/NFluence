import React from "react";
import cn from "classnames";
import styles from "./FolowSteps.module.sass";
import Icon from "../../../components/Icon";
import Loader from "../../../components/Loader";
import LoaderCircle from "../../../components/LoaderCircle";

const FolowSteps = ({ className, obj, onClose, err }) => {
  return (
    <div className={cn(className, styles.steps)}>
      <div className={cn("h4", styles.title)}>Creating your NFT</div>
      <div className={styles.list}>
        {(!obj.load && !obj.loading && !obj.err && !obj.error) && (<div className={cn(styles.item, styles.done)}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="upload-file" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Mint Successful!</div>
              <div className={styles.text}>Check your profile to see your NFT</div>
            </div>
          </div>
          <button className={cn("button done", styles.button)} onClick={onClose} >Done</button>
        </div>)}
        {(obj.loading || obj.load) && (<div className={styles.item}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <LoaderCircle className={styles.loader} />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Minting...</div>
              <div className={styles.text}>
                This may take up to a couple minutes to complete. You'll need a to sign a transaction in the next popup.
              </div>
            </div>
          </div>
          <button className={cn("button loading", styles.button)}>
            <Loader className={styles.loader} color="white" />
          </button>
        </div>)}
        {((obj.error || obj.err) && !obj.loading && !obj.load) && (<div className={cn(styles.item, styles.error)}>
          <div className={styles.head}>
            <div className={styles.icon}>
              <Icon name="pencil" size="24" />
            </div>
            <div className={styles.details}>
              <div className={styles.info}>Whoops</div>
              <div className={styles.info}>
              Something went wrong, please refresh and try again
              </div>
              <div className={styles.text}>
              {err}
              </div>
            </div>
          </div>
          <button className={cn("button error", styles.button)}>Transaction Failed</button>
        </div>)}
      </div>
    </div>
  );
};

export default FolowSteps;
