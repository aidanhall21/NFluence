import React, { useRef, useState } from "react";
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


const User = ({ className, data, handle }) => {
  const [visible, setVisible] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false)
  const [almost, setAlmost] = useState(false)
  const [error, setError] = useState(false)

  const socials = [
    {
      title: "twitter",
      url: `https://twitter.com/${data.twitter !== null ? data.twitter : ''}`,
    },
    {
      title: "instagram",
      url: `https://www.instagram.com/${data.instagram !== null ? data.instagram : ''}`,
    },
  ];

  const { user } = useAuth()
  const { collection, collectionLoading, createCollection, createFUSDVault, fetchUserData, collectionError } = useUser()
  const err = useRef(collectionError);

  const addVerification = async () => {
    await axios.put(`${api_node}/api/v1/user/verify`, {
      verify: true,
      address: user?.addr
    })
  }

  const addToDb = async () => {
    if (!data.db) {
      console.log('adding to db')
      await axios.post(`${api_node}/api/v1/user`, {
        name: data.name,
        email: data.email,
        avatar: data.avatar,
        db: true,
        verified: data.verified,
        cover_image: data.cover_image,
        profile_image: data.profile_image,
        handle: data.handle,
        address: user?.addr,
        bio: data.bio,
        url: data.url,
        twitter: data.twitter,
        instagram: data.instagram
      })
    }
  }

  const verifyVault = async () => {
    setAlmost(true)
    let txStatus = await createFUSDVault()
    if (!txStatus) {
      setAlmost(false)
      setVerifying(false)
      return
    }
    console.log('nex step')
    await addToDb()
    await addVerification()
    setAlmost(false)
    setSuccess(true)
    await fetchUserData()
    setVerifying(false)
  }

  const verify = async () => {
    setVerifying(true)
    if (!collection) {
      let txStatus = await createCollection()
      if (!txStatus) {
        setVerifying(false)
        return
      }
    }
    console.log('NEXT')
    await verifyVault()
  }

  return (
    <>
      <div className={cn(styles.user, className)}>
        <div className={styles.avatar}>
        {data.profile_image ? <img src={`https://nfluence-assets.s3.amazonaws.com/${user?.addr}-profile`} alt="Avatar" /> : <img src={`data:image/png;base64,${data.avatar}`} alt="Avatar" />}
        </div>
        <div className={styles.name}>{data.name}</div>
        <div className={styles.code}>
          <div className={styles.number}>@{data.handle}</div>
        </div>
        <div className={styles.info}>
          {data.bio}
        </div>
        {data.url ? <a
          className={styles.site}
          href={`https://${data.url}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icon name="globe" size="16" />
          <span>{data.url}</span>
        </a> : <></>}
        {/*profile.handle === handle ? <></> : (<div className={styles.control}>
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
              </div>)*/}
        {data.address !== user?.addr || data.verified || almost ? <></> : (<div className={styles.control}>
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
        {almost && (<span>Just one more thing...</span>)}
        {success && (<span>You're now verified!</span>)}
        {error && (<span>Something went wrong, please contact us</span>)}
        <div className={styles.socials}>
          {socials.map((x, index) => (
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
