import React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Description.module.sass";
import Image from "../../../components/Image";

const Description = () => {
  return (
    <div className={styles.section}>
      <div className={cn("container", styles.container)}>
        <div className={styles.wrap}>
          <div className={styles.stage}>Create provably scarce and ownable digital content</div>
          <h1 className={cn("h1", styles.title)}>
          The NFT Platform For Influencers
          </h1>
          <div className={styles.text}>
            Welcome to the future of brand monetization
          </div>
          <div className={styles.btns}>
            <Link className={cn("button", styles.button)} to="/upload-variants">
              Create item
            </Link>
            {/*<Link className={cn("button-stroke", styles.button)} to="/search01">
              Discover more
              </Link>*/}
          </div>
        </div>
        <div className={styles.gallery}>
          <div className={styles.preview}>
            <Image
              srcSet="/images/nsft-logo.jpeg 2x"
              srcSetDark="/images/nsft-logo-dark.jpeg 2x"
              src="/images/nsft-logo.jpeg"
              srcDark="/images/nsft-logo-dark.jpeg"
              alt="Logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
