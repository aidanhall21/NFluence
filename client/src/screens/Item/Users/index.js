import React from "react";
import cn from "classnames";
import styles from "./Users.module.sass";

const Users = ({ className, items }) => {
  console.log(items)
  return (
    <div className={cn(styles.users, className)}>
      <div className={styles.list}>
        {items.map((x, index) => (
          <div className={styles.item} key={index}>
            <div className={styles.avatar}>
            {x.profile_image ? <img src={`/user-images/${x.address}-profile.jpg`} alt="Avatar" /> : <img src={`data:image/png;base64,${x.avatar}`} alt="Avatar" />}
            </div>
            <div className={styles.details}>
              <div className={styles.position}>{x.position}</div>
              <div className={styles.name}>@{x.handle}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
