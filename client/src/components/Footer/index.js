import React from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import styles from "./Footer.module.sass";
import Group from "./Group";
import Image from "../Image";
import Form from "../Form";
import Theme from "../Theme";

const items = [
  {
    title: "NSFT",
    menu: [
      {
        title: "Support",
        url: "mailto:aidan@nsftonight.com",
      },
    ],
  },
  {
    title: "Info",
    menu: [
      {
        title: "FAQ",
        url: "/faq",
      },
      {
        title: "Create item",
        url: "/upload-variants",
      },
    ],
  },
];

const Footers = () => {
  //const [email, setEmail] = useState("");

  //const handleSubmit = (e) => {
  //alert();
  //};

  return (
    <footer className={styles.footer}>
      <div className={cn("container", styles.container)}>
            <div className={styles.version}>
              <div className={styles.details}>Dark theme</div>
              <Theme className="theme-big" />
            </div>
        <div className={styles.foot}>
          <div className={styles.copyright}>
            Copyright © 2021 Long Hall Labs LLC. All rights reserved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footers;
