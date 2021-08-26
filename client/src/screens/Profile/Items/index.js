import React from "react";
import cn from "classnames";
import styles from "./Items.module.sass";
import Card from "../../../components/Card";

const Items = ({ className, items }) => {
  return (
    <div className={cn(styles.items, className)}>
      <div className={styles.list}>
        {items.map((x, index) => (
          <Card className={styles.card} item={x} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Items;
