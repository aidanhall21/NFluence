import React, { useState } from "react";
import cn from "classnames";
import { Link, useParams } from "react-router-dom";
import styles from "./Profile.module.sass";
import Icon from "../../components/Icon";
import User from "./User";
import Items from "./Items";
import Followers from "./Followers";


// data
import { bids } from "../../mocks/bids";
import axios from "axios";
import { useAuth } from "../../providers/AuthProvider";
import { useUser } from "../../providers/UserProvider";

const navLinks = [
  "Your Auctions",
  "Your Bids",
  "Created",
  "Owned",
  "Following",
  "Followers",
];

const following = [
  {
    name: "Sally Fadel",
    counter: "161 followers",
    avatar: "/images/content/avatar-5.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-2.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-4.jpg",
    ],
  },
  {
    name: "Aniya Harber",
    counter: "161 followers",
    avatar: "/images/content/avatar-6.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-6.jpg",
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
    ],
  },
  {
    name: "Edwardo Bea",
    counter: "161 followers",
    avatar: "/images/content/avatar-7.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-4.jpg",
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-6.jpg",
    ],
  },
  {
    name: "Reymundo",
    counter: "161 followers",
    avatar: "/images/content/avatar-8.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-2.jpg",
      "/images/content/follower-pic-6.jpg",
      "/images/content/follower-pic-1.jpg",
    ],
  },
  {
    name: "Jeanette",
    counter: "161 followers",
    avatar: "/images/content/avatar-9.jpg",
    url: "https://ui8.net",
    buttonClass: "stroke",
    buttonContent: "Unfollow",
    gallery: [
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-4.jpg",
    ],
  },
];

const followers = [
  {
    name: "Sally Fadel",
    counter: "161 followers",
    avatar: "/images/content/avatar-5.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-2.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-4.jpg",
    ],
  },
  {
    name: "Aniya Harber",
    counter: "161 followers",
    avatar: "/images/content/avatar-6.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-6.jpg",
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
    ],
  },
  {
    name: "Edwardo Bea",
    counter: "161 followers",
    avatar: "/images/content/avatar-7.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-4.jpg",
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-6.jpg",
    ],
  },
  {
    name: "Reymundo",
    counter: "161 followers",
    avatar: "/images/content/avatar-8.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-2.jpg",
      "/images/content/follower-pic-6.jpg",
      "/images/content/follower-pic-1.jpg",
    ],
  },
  {
    name: "Jeanette",
    counter: "161 followers",
    avatar: "/images/content/avatar-9.jpg",
    url: "https://ui8.net",
    buttonClass: "blue",
    buttonContent: "Follow",
    gallery: [
      "/images/content/follower-pic-1.jpg",
      "/images/content/follower-pic-3.jpg",
      "/images/content/follower-pic-5.jpg",
      "/images/content/follower-pic-4.jpg",
    ],
  },
];

let api_node;
process.env.NODE_ENV === "production"
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE

const Profile = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [file, setFile] = useState(null)

  const { handle } = useParams();

  const { user } = useAuth()
  const { profile, userNsfts } = useUser()

  const socials = [
    {
      title: "twitter",
      url: `https://twitter.com/${profile.twitter}`,
    },
    {
      title: "instagram",
      url: `https://www.instagram.com/${profile.instagram}`,
    },
  ];

  const onCoverPhotoChange = (e) => {
    setFile(e.target.files[0])
  }

  const onCoverPhotoSubmit = (e) => {
    let data = new FormData()
    let ext_array = file.name.split('.')
    let ext = ext_array[ext_array.length - 1]
    data.append('file', file, user?.addr + '-cover.' + ext)
    axios.post(`${api_node}/api/v1/upload`, data, {})
    profile.verified ?
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
      verified: true,
      cover_image: true,
      profile_image: false,
      handle: profile.handle,
      address: user?.addr,
      bio: profile.bio,
      url: profile.url,
      twitter: profile.twitter,
      instagram: profile.instagram
    })
  }

  return (
    <div className={styles.profile}>
      <div
        className={cn(styles.head, { [styles.active]: visible })}
        style={profile.cover_image ? {
          backgroundImage: `url(/user-images/${user?.addr}-cover.jpg)`,
        } : {
          backgroundImage: "url(/images/content/bg-profile.jpg)",
        }}
      >
        <div className={cn("container", styles.container)}>
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
              onClick={() => {
                setVisible(false)
                onCoverPhotoSubmit()
              }}
            >
              Save photo
            </button>
          </div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={cn("container", styles.container)}>
          <User className={styles.user} item={socials} handle={handle} />
          <div className={styles.wrapper}>
            <div className={styles.nav}>
              {navLinks.map((x, index) => (
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
                {/*activeIndex === 0 && (
                  <Items class={styles.items} items={bids.slice(0, 3)} />
                )*/}
                {/*activeIndex === 1 && (
                  <Items class={styles.items} items={bids.slice(0, 6)} />
                )*/}
                {activeIndex === 2 && (
                  <Items class={styles.items} items={userNsfts} />
                )}
                {/*activeIndex === 3 && (
                  <Items class={styles.items} items={bids.slice(0, 3)} />
                )*/}
                {activeIndex === 4 && (
                  <Followers className={styles.followers} items={following} />
                )}
                {activeIndex === 5 && (
                  <Followers className={styles.followers} items={followers} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
