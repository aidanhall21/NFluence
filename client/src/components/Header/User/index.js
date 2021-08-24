import React, { useState } from "react";
import { Link } from "react-router-dom";
import cn from "classnames";
import OutsideClickHandler from "react-outside-click-handler";
import styles from "./User.module.sass";
import Icon from "../../Icon";
import Theme from "../../Theme";
import { useAuth } from "../../../providers/AuthProvider";
import { useUser } from "../../../providers/UserProvider";

const items = [
  {
    title: "My profile",
    icon: "user",
    url: "/profile",
  },
  {
    title: "My items",
    icon: "image",
    url: "/item",
  },
  {
    title: "Dark theme",
    icon: "bulb",
  },
  {
    title: "Disconnect",
    icon: "exit",
    url: "/",
  },
];

const User = ({ className }) => {
  const [visible, setVisible] = useState(false);
  const { user, logOut } = useAuth()
  const { balance, profile } = useUser()

  return (
    <OutsideClickHandler onOutsideClick={() => setVisible(false)}>
      <div className={cn(styles.user, className)}>
        <div className={styles.head} onClick={() => setVisible(!visible)}>
          <div className={styles.avatar}>
          {profile.profile_image ? <img src={`/user-images/${user?.addr}-profile.jpg`} alt="Avatar" /> : <img src={`data:image/png;base64,${profile.avatar}`} alt="Avatar" />}
          </div>
          <div className={styles.wallet}>
            @{profile.handle}
          </div>
        </div>
        {visible && (
          <div className={styles.body}>
            <div className={styles.name}>{profile.name}</div>
            <div className={styles.code}>
              <div className={styles.number}>{user?.addr}</div>

            </div>
            <div className={styles.wrap}>
              <div className={styles.line}>
                <div className={styles.preview}>
                {profile.profile_image ? <img src={`/user-images/${user?.addr}-profile.jpg`} alt="Avatar" /> : <img src={`data:image/png;base64,${profile.avatar}`} alt="Avatar" />}
                </div>
                <div className={styles.details}>
                  <div className={styles.info}>Balance</div>
                  <div className={styles.price}>${balance.slice(0, -6)}</div>
                </div>
              </div>
              <button
                className={cn("button-stroke button-small", styles.button)}
              >
                Manage Funds
              </button>
            </div>
            <div className={styles.menu}>
              {items.map((x, index) =>
                x.url ? (
                  x.title.startsWith("Disconnect") ? (
                    <Link className={styles.item} onClick={logOut} to={x.url} key={index}>
                      <div className={styles.icon}>
                        <Icon name={x.icon} size="20" />
                      </div>
                      <div className={styles.text}>{x.title}</div>
                      </Link>
                   
                  ) : (
                    <Link
                      className={styles.item}
                      to={`${x.url}/${profile.handle}`}
                      onClick={() => setVisible(!visible)}
                      key={index}
                    >
                      <div className={styles.icon}>
                        <Icon name={x.icon} size="20" />
                      </div>
                      <div className={styles.text}>{x.title}</div>
                    </Link>
                  )
                ) : (
                  <div className={styles.item} key={index}>
                    <div className={styles.icon}>
                      <Icon name={x.icon} size="20" />
                    </div>
                    <div className={styles.text}>{x.title}</div>
                    <Theme className={styles.theme} />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </OutsideClickHandler>
  );
};

export default User;
