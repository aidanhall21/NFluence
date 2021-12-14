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
    buttonText: "Create Single NFT (1 of 1)",
    image: "/images/nfluence-logo-light.jpg",
    imageDark: "/images/nfluence-logo-dark.jpg",
    image2x: "/images/nfluence-logo-light.jpg",
    imageDark2x: "/images/nfluence-logo-dark.jpg"
  },
  {
    url: "/upload-multiple",
    buttonText: "Create NFT Edition (1 of Many)",
    image: "/images/nfluence-logo-light.jpg",
    imageDark: "/images/nfluence-logo-dark.jpg",
    image2x: "/images/nfluence-logo-light.jpg",
    imageDark2x: "/images/nfluence-logo-dark.jpg"
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
                {/*<Image
              srcSet="/images/nfluence-logo.jpg 2x"
              srcSetDark="/images/nfluence-logo-dark.jpg 2x"
              src="/images/nfluence-logo-light.jpg"
              srcDark="/images/nfluence-logo-dark.jpg"
              alt="Logo"
                />*/}
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
