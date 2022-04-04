import React from "react";
import cn from "classnames";
import styles from "./Footer.module.sass";
import Theme from "../Theme";

const Footers = () => {

  return (
    <footer className={styles.footer}>
      <div className={cn("container", styles.container)}>
            <div className={styles.version}>
              <div className={styles.details}>Dark theme</div>
              <Theme className="theme-big" />
            </div>
        <div className={styles.foot}>
          <div className={styles.copyright}>
            Copyright © 2022 Long Hall Labs LLC. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
