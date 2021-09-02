import React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Description.module.sass";
import Image from "../../../components/Image";
import { useAuth } from "../../../providers/AuthProvider";

const Description = () => {

  const { loggedIn, logIn } = useAuth()

  return (
    <div className={styles.section}>
      <div className={cn("container", styles.container)}>
        <div className={styles.wrap}>
          <div className={styles.stage}>Digital proof of fandom</div>
          <h1 className={cn("h1", styles.title)}>
          The NFT Platform For Exclusive {'&'} Premium Content
          </h1>
          <div className={styles.text}>
            Welcome to the new frontier of brand monetization
          </div>
          <div className={styles.btns}>
          {!loggedIn ? <button
          className={cn("button", styles.button)}
          onClick={logIn}>
          Sign Up
        </button> :
        <Link className={cn("button", styles.button)} to="/upload-variants">
        Create Item
      </Link>}
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
