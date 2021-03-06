import React, { useEffect, useState } from "react";
import cn from "classnames";
import { Link, useHistory, useParams } from "react-router-dom";
import styles from "./Profile.module.sass";
import Icon from "../../components/Icon";
import User from "./User";
import Items from "./Items";
import axios from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { useUser } from "../../providers/UserProvider";

const userLinks = [
  "Your Auctions",
  "Your Bids",
  "Created",
  "Owned",
]

const accountLinks = [
  "Live Auctions",
]


let api_node;

process.env.NODE_ENV === "production"
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE

const Profile = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [profData, setProfData] = useState({})
  const [auctions, setAuctions] = useState([])
  const [src, setSrc] = useState('')
  const [loading, setLoading] = useState(false)

  const { handle } = useParams();

  const { user } = useAuth()
  const { profile, userNsfts, bids, userAuctions, userOwned, fetchAccountLiveAuctions } = useUser()
  const history = useHistory()

  useEffect(() => {
    setProfData(profile)
    if (profile.handle === handle) return
    const getProfileData = async () => {
      try {
        const api = await axios.get(`${api_node}/api/v1/handle/${handle}`)
        if (api.data.length === 0) return
        const addr = api.data[0]
        const data = await axios.get(`${api_node}/api/v1/user/${addr.address}`)
        setProfData(data.data[0])
      } catch(err) {
        console.log(err)
        history.push('/oh-shit')
      }
    }
    getProfileData()
    //eslint-disable-next-line
  }, [handle, profile])

  useEffect(() => {
    setAuctions(userAuctions)
    if (profile.handle === handle) return
    if (!profData.address) return
    const updateAuctions = async () => {
      let auctionData = await fetchAccountLiveAuctions(profData.address)
      setAuctions(auctionData)
    }
    updateAuctions()
  }, [profData, userAuctions, fetchAccountLiveAuctions, handle, profile.handle])

  useEffect(() => {
    profile.cover_image ? setSrc(`url(https://nfluence-assets.s3.amazonaws.com/${user?.addr}-cover)`) : setSrc(`url(/images/content/bg-profile.jpg)`)
  }, [profile, user?.addr]);

  function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          setSrc(`url(${url})`)
          setLoading(false)
        }
        else {
          alert('Could not upload file');
        }
      }
    };
    xhr.send(file);
  }

  const getSignedRequest = (file) => {
    const xhr = new XMLHttpRequest();
    //const type = file.type.split('/')[1]
    const filename = `${user?.addr}-cover`
    xhr.open('GET', `${api_node}/api/v1/sign-s3?file-name=${filename}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          uploadFile(file, response.signedRequest, response.url)
        }
        else {
          alert('Could not get signed URL');
        }
      }
    };
    xhr.send();
  }

  const onCoverPhotoChange = (e) => {
    setLoading(true)
    const file = e.target.files[0]
    if (file == null) {
      return alert('No file selected.');
    }
    getSignedRequest(file)

    profile.db ?
    axios.put(`${api_node}/api/v1/user/update`, {
      name: profile.name,
      email: profile.email,
      handle: profile.handle,
      cover_image: true,
      profile_image: profile.profile_image,
      address: user?.addr,
      bio: profile.bio,
      url: profile.url,
      twitter: profile.twitter,
      instagram: profile.instagram
    }) : axios.post(`${api_node}/api/v1/user`, {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      db: true,
      cover_image: true,
      profile_image: profile.profile_image,
      handle: profile.handle,
      address: user?.addr,
      bio: profile.bio,
      url: profile.url,
      twitter: profile.twitter,
      instagram: profile.instagram,
      verified: profile.verified
    })
  }

  return (
    <div className={styles.profile}>
      <div
        className={cn(styles.head, { [styles.active]: visible })}
        style={{ backgroundImage: src }}
      >
        {handle === profile.handle && (<div className={cn("container", styles.container)}>
          <div className={styles.btns}>
            <button
              className={cn("button-stroke button-small", styles.button)}
              onClick={() => setVisible(true)}
            >
              <span>Edit cover photo</span>
              <Icon name="edit" size="16" />
            </button>
            <Link
              className={cn("button-stroke button-small", styles.button)}
              to="/profile-edit"
            >
              <span>Edit profile</span>
              <Icon name="image" size="16" />
            </Link>
          </div>
          <div className={styles.file}>
            <input type="file" name="file" accept="image/*" onChange={onCoverPhotoChange} />
            <div className={styles.wrap}>
              <Icon name="upload-file" size="48" />
              <div className={styles.info}>Drag and drop your photo here</div>
              <div className={styles.text}>or click to browse</div>
            </div>
            <button
              className={cn("button-small", styles.button)}
              disabled={loading}
              onClick={() => {
                setVisible(false)
                //window.location.reload()
              }}
            >
              Save photo
            </button>
          </div>
        </div>)}
      </div>
      <div className={styles.body}>
        <div className={cn("container", styles.container)}>
          <User className={styles.user} data={profData} handle={handle} />
          <div className={styles.wrapper}>
            <div className={styles.nav}>
              {handle === profile.handle ? userLinks.map((x, index) => (
                <button
                  className={cn(styles.link, {
                    [styles.active]: index === activeIndex,
                  })}
                  key={index}
                  onClick={() => setActiveIndex(index)}
                >
                  {x}
                </button>
              )) : accountLinks.map((x, index) => (
                <button
                  className={cn(styles.link, {
                    [styles.active]: index === activeIndex,
                  })}
                  key={index}
                  onClick={() => setActiveIndex(index)}
                >
                  {x}
                </button>
              ))}
            </div>
            <div className={styles.group}>
              <div className={styles.item}>
                {activeIndex === 0 &&  (
                  <Items class={styles.items} items={auctions} />
                )}
                {activeIndex === 1 && (
                  <Items class={styles.items} items={bids} />
                )}
                {activeIndex === 2 && handle === profile.handle && (
                  <Items class={styles.items} items={userNsfts} />
                )}
                {activeIndex === 3 && (
                  <Items class={styles.items} items={userOwned} />
                )}
                {/*{activeIndex === 4 && (
                  <Followers className={styles.followers} items={following} />
                )}
                {activeIndex === 5 && (
                  <Followers className={styles.followers} items={followers} />
                )}*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
