import React, { useEffect, useRef, useState } from "react";
import cn from "classnames";
import styles from "./ProfileEdit.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import { useAuth } from "../../providers/AuthProvider";
import { useUser } from "../../providers/UserProvider";
import axios from "axios";
/*
let crypto;
try {
  crypto = require('crypto');
} catch (err) {
  console.log('crypto support is disabled!');
}
*/

import * as crypto from 'crypto';

const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Edit Profile",
  },
];

let api_node;
process.env.NODE_ENV === "production"
  ? (api_node = "")
  : (api_node = process.env.REACT_APP_LOCAL_API_NODE);

const ProfileEdit = () => {
  const { user } = useAuth();
  const { profile } = useUser();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [change, setChange] = useState(false);
  const [bio, setBio] = useState("");
  const [url, setUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [insta, setInsta] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [src, setSrc] = useState("");

  function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signedRequest);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        console.log(xhr)
        if (xhr.status === 200) {
          setSrc(url);
        } else {
          alert("Could not upload file");
        }
      }
    };
    xhr.send(file);
  }

  const getSignedRequest = (file) => {
    const xhr = new XMLHttpRequest();
    //const type = file.type.split('/')[1]
    const filename = `${user?.addr}-profile`;
    xhr.open(
      "GET",
      `${api_node}/api/v1/sign-s3?file-name=${filename}&file-type=${file.type}`
    );
    xhr.setRequestHeader("Accept", "application/json")
    xhr.setRequestHeader("Content-Type", "application/json")
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(response)
          uploadFile(file, response.signedRequest, response.url);
        } else {
          alert("Could not get signed URL");
        }
      }
    };
    xhr.send();
  };

  const onProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file == null) {
      console.log('Ive lost me mojo')
      return alert("No file selected.");
    }
    getSignedRequest(file);
    profile.db
      ? axios.put(`${api_node}/api/v1/user/update`, {
          name: profile.name,
          email: profile.email,
          handle: profile.handle,
          cover_image: profile.cover_image,
          profile_image: true,
          address: user?.addr,
          bio: profile.bio,
          url: profile.url,
          twitter: profile.twitter,
          instagram: profile.instagram,
        })
      : axios.post(`${api_node}/api/v1/user`, {
          name: profile.name,
          email: profile.email,
          handle: profile.handle,
          avatar: profile.avatar,
          address: user?.addr,
          db: true,
          cover_image: false,
          profile_image: true,
          bio: profile.bio,
          url: profile.url,
          twitter: profile.twitter,
          instagram: profile.instagram,
          verified: profile.verified,
        });
    //window.location.reload();
  };

  const handleNameChange = async (e) => {
    setName(e);
  };

  const handleUsernameChange = async (e) => {
    setUsername(e);
    setChange(true);
  };

  const handleBioChange = async (e) => {
    setBio(e);
  };

  const handleUrlChange = async (e) => {
    setUrl(e);
  };

  const handleTwitterChange = async (e) => {
    setTwitter(e);
  };

  const handleInstagramChange = async (e) => {
    setInsta(e);
  };

  const handleEmailChange = async (e) => {
    setEmail(e);
  };

  useEffect(() => {
    setName(profile.name);
    setUsername(profile.handle);
    setBio(profile.bio);
    setUrl(profile.url);
    setTwitter(profile.twitter);
    setInsta(profile.instagram);
    setEmail(profile.email);
    profile.profile_image
      ? setSrc(`https://nfluence-assets.s3.amazonaws.com/${user?.addr}-profile`)
      : setSrc(`data:image/png;base64,${profile.avatar}`);
  }, [profile, user?.addr]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let taken = false;

    if (change) {
      const API = await axios.get(`${api_node}/api/v1/usernames/${username}`);
      const serverResponse = API.data;

      if (serverResponse[0].num_unique !== "0") {
        taken = true;
      }
    }
    if (taken) {
      setErrors(true);
      return;
    } else {
      profile.db
        ? axios.put(`${api_node}/api/v1/user/update`, {
            name: name,
            email: email,
            handle: username,
            cover_image: profile.cover_image,
            profile_image: profile.profile_image,
            address: user?.addr,
            bio: bio,
            url: url,
            twitter: twitter,
            instagram: insta,
          })
        : axios.post(`${api_node}/api/v1/user`, {
            name: name,
            email: email,
            avatar: profile.avatar,
            db: true,
            cover_image: profile.cover_image,
            profile_image: profile.profile_image,
            handle: username,
            address: user?.addr,
            bio: bio,
            url: url,
            twitter: twitter,
            instagram: insta,
            verified: profile.verified,
          });
      setUpdateSuccess(true);
      //await fetchUserData()
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  
  const urlWithSignature = useRef('');
  //buy-staging for test
  useEffect(() => {
    const originalUrl = `https://buy.moonpay.com?apiKey=${process.env.REACT_APP_MOONPAY_PUBLISHABLE_KEY}&currencyCode=fusd&walletAddress=${user?.addr}&redirectURL=https%3A%2F%2Fwww.nfluence.fans%2F`
    const signature = crypto.createHmac('sha256', `${process.env.REACT_APP_MOONPAY_SECRET_KEY}`)
      .update(new URL(originalUrl).search)
      .digest('base64');
    urlWithSignature.current = `${originalUrl}&signature=${encodeURIComponent(signature)}`;
  }, [user?.addr])

  return (
    <div className={styles.page}>
      <Control className={styles.control} item={breadcrumbs} />
      <div className={cn("section-pt80", styles.section)}>
        <div className={cn("container", styles.container)}>
          <div className={styles.top}>
            <h1 className={cn("h2", styles.title)}>Edit profile</h1>
          </div>
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.user}>
                <div className={styles.avatar}>
                  <img id="preview" src={src} alt="Avatar" />
                </div>
                <div className={styles.details}>
                  <div className={styles.stage}>Profile photo</div>
                  <div className={styles.file}>
                    <button
                      className={cn(
                        "button-stroke button-small",
                        styles.button
                      )}
                    >
                      Upload
                    </button>
                    <input
                      className={styles.load}
                      type="file"
                      name="file"
                      accept="image/*"
                      onChange={onProfilePhotoChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.col}>
              <div className={styles.list}>
                <div className={styles.item}>
                  <div className={styles.category}>Account info</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="name"
                      name="Name"
                      type="text"
                      placeholder={
                        profile.name ? profile.name : "Enter your name"
                      }
                      required
                      onChange={(e) => handleNameChange(e.currentTarget.value)}
                    />
                    <TextInput
                      className={styles.field}
                      label="Username"
                      name="Handle"
                      type="text"
                      placeholder={
                        profile.handle ? profile.handle : "Enter your Username"
                      }
                      required
                      onChange={(e) =>
                        handleUsernameChange(e.currentTarget.value)
                      }
                    />

                    <TextInput
                      className={styles.field}
                      label="email"
                      name="Email"
                      type="text"
                      placeholder={
                        profile.email ? profile.email : "Enter your email"
                      }
                      required
                      onChange={(e) => handleEmailChange(e.currentTarget.value)}
                    />
                    <TextArea
                      className={styles.field}
                      label="Bio"
                      name="Bio"
                      placeholder={
                        profile.bio
                          ? profile.bio
                          : "About yourself in a few words"
                      }
                      required="required"
                      onChange={(e) => handleBioChange(e.currentTarget.value)}
                    />
                  </div>
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>
                    Fund Your Account with USD
                  </div>
                  {(<a
                    className={cn("button-small", styles.button)}
                    href={profile.verified ? `${urlWithSignature.current}` : `#`}
                  >
                    Add Funds
                  </a>)}
                  {!profile.verified && (
                    <div>You must verify your account before you can deposit.</div>
                  )}
                  {/*<div className={styles.fieldset}>
                    {loading && (
                      <div className={styles.item}>
                        <button className={cn("button loading", styles.button)}>
                          <Loader className={styles.loader} color="white" />
                        </button>
                      </div>
                    )}
                    {success && (
                      <div className={cn(styles.item, styles.done)}>
                        <button className={cn("button success", styles.button)}>
                          Deposit Successful!
                        </button>
                      </div>
                    )}
                    {error && (
                      <div className={cn(styles.item, styles.error)}>
                        <button className={cn("button error", styles.button)}>
                          Deposit Failed
                        </button>
                      </div>
                    )}
                    {!loading && !error && !success && (
                      <Form
                        className={styles.form}
                        placeholder="Enter an amount in USD"
                        setValue={setDeposit}
                        type="number"
                        name="price"
                        action={`${api_node}/api/v1/create-checkout-session?deposit=${deposit}`}
                        method="POST"
                        step={1}
                        min={0}
                      />
                    )}
                    {verified && (<div>You must verify your account before you can mint</div>)}
                    </div>*/}
                </div>
                <div className={styles.item}>
                  <div className={styles.category}>Social</div>
                  <div className={styles.fieldset}>
                    <TextInput
                      className={styles.field}
                      label="portfolio or website"
                      name="Portfolio"
                      type="text"
                      placeholder={profile.url ? profile.url : "Enter URL"}
                      required
                      onChange={(e) => handleUrlChange(e.currentTarget.value)}
                    />
                    <TextInput
                      className={styles.field}
                      label="twitter"
                      name="Twitter"
                      type="text"
                      placeholder={
                        profile.twitter ? profile.twitter : "@twitter username"
                      }
                      required
                      onChange={(e) =>
                        handleTwitterChange(e.currentTarget.value)
                      }
                    />
                    <TextInput
                      className={styles.field}
                      label="instagram"
                      name="Instagram"
                      type="text"
                      placeholder={
                        profile.instagram
                          ? profile.instagram
                          : "@instagram username"
                      }
                      required
                      onChange={(e) =>
                        handleInstagramChange(e.currentTarget.value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className={styles.btns}>
                <button
                  className={cn("button", styles.button)}
                  onClick={(e) => handleSubmit(e)}
                >
                  {!updateSuccess ? "Update Profile" : "Update Successful!"}
                </button>
                {errors && <div>Your username has been taken already :(</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
