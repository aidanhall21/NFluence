import React, { useState } from "react";
import cn from "classnames";
import styles from "./User.module.sass";
import Icon from "../../../components/Icon";
import { useUser } from "../../../providers/UserProvider";
import { useAuth } from "../../../providers/AuthProvider";
import axios from "axios";
// import { isStepDivisible } from "react-range/lib/utils";

let api_node;
process.env.NODE_ENV === "production"
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE


const User = ({ className, item, handle }) => {
  const [visible, setVisible] = useState(false);
  const [verifying, setVerifying] = useState(false)

  const { user } = useAuth()
  const { profile, collection, createCollection } = useUser()

  const verify = async () => {
    setVerifying(true)
    await createCollection()
    axios.put(`${api_node}/api/v1/user/verify`, {
      verify: true,
      address: user?.addr
    })
  }

  return (
    <>
      <div className={cn(styles.user, className)}>
        <div className={styles.avatar}>
        {profile.profile_image ? <img src={`/user-images/${user?.addr}-profile.jpg`} alt="Avatar" /> : <img src={`data:image/png;base64,${profile.avatar}`} alt="Avatar" />}
        </div>
        <div className={styles.name}>{profile.name}</div>
        <div className={styles.code}>
          <div className={styles.number}>@{profile.handle}</div>
        </div>
        <div className={styles.info}>
          {profile.bio}
        </div>
        {profile.url ? <a
          className={styles.site}
          href={`https://${profile.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="globe" size="16" />
          <span>{profile.url}</span>
        </a> : <></>}
        {profile.handle === handle ? <></> : (<div className={styles.control}>
          <div className={styles.btns}>
            <button
              className={cn(
                "button button-small",
                { [styles.active]: visible },
                styles.button
              )}
              onClick={() => setVisible(!visible)}
            >
              <span>Follow</span>
              <span>Unfollow</span>
            </button>
          </div>
        </div>)}
        {profile.verified ? <></> : (<div className={styles.control}>
          <div className={styles.btns}>
            <button
              className={cn(
                "button button-small",
                { [styles.active]: visible },
                styles.button
              )}
              onClick={verify}
            >
              <span>{verifying ? 'One moment...' : "Verify"}</span>
            </button>
          </div>
        </div>)}
        <div className={styles.socials}>
          {item.map((x, index) => (
            <a
              className={styles.social}
              href={x.url}
              target="_blank"
              rel="noopener noreferrer"
              key={index}
            >
              <Icon name={x.title} size="20" />
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default User;
