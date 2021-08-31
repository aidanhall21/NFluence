import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./UploadVariants.module.sass";
import Control from "../../components/Control";
import Image from "../../components/Image";

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Upload Item",
  },
];

const items = [
  {
    url: "/upload-single",
    buttonText: "Create Single",
    image: "/images/nsft-logo.jpeg",
    imageDark: "/images/nsft-logo-dark.jpeg",
    image2x: "/images/nsft-logo.jpeg",
    imageDark2x: "/images/nsft-logo-dark.jpeg"
  },
  {
    url: "/upload-multiple",
    buttonText: "Create Multiple",
    image: "/images/nsft-logo.jpeg",
    imageDark: "/images/nsft-logo-dark.jpeg",
    image2x: "/images/nsft-logo.jpeg",
    imageDark2x: "/images/nsft-logo-dark.jpeg"
  },
];

const Upload = () => {
  return (
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Upload item</h1>
            <div className={styles.info}>
              Choose <span>“Single”</span> if you want your collectible to be
              one of a kind or <span>“Multiple”</span> if you want to sell one
              collectible multiple times
            </div>
          </div>
          <div className={styles.list}>
            {items.map((x, index) => (
              <div className={styles.item} key={index}>
                <div className={styles.preview}>
                <Image
              srcSet="/images/nsft-logo.jpeg 2x"
              srcSetDark="/images/nsft-logo-dark.jpeg 2x"
              src="/images/nsft-logo.jpeg"
              srcDark="/images/nsft-logo-dark.jpeg"
              alt="Logo"
            />
                </div>
                <Link className={cn("button-stroke", styles.button)} to={x.url}>
                  {x.buttonText}
                </Link>
              </div>
            ))}
          </div>
          {/*<div className={styles.note}>
            We do not own your private keys and cannot access your funds without
            your confirmation.
            </div>*/}
        </div>
      </div>
    </div>
  );
};

export default Upload;
