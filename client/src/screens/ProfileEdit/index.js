import React, { useEffect, useState } from "react";
import cn from "classnames";
import styles from "./ProfileEdit.module.sass";
import Control from "../../components/Control";
import TextInput from "../../components/TextInput";
import TextArea from "../../components/TextArea";
import { useAuth } from "../../providers/AuthProvider";
import { useUser } from "../../providers/UserProvider";
import axios from "axios";

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
  ? api_node = ''
  : api_node = process.env.REACT_APP_LOCAL_API_NODE


const ProfileEdit = () => {
  const { user } = useAuth()
  const { profile } = useUser()
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [change, setChange] = useState(false)
  const [bio, setBio] = useState('')
  const [url, setUrl] = useState('')
  const [twitter, setTwitter] = useState('')
  const [insta, setInsta] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState(false)

  const onProfilePhotoChange = (e) => {
    let data = new FormData()
    let file = e.target.files[0]
    let ext_array = file.name.split('.')
    let ext = ext_array[ext_array.length - 1]
    data.append('file', file, user?.addr + '-profile.' + ext)
    axios.post(`${api_node}/api/v1/upload`, data, {})
    profile.db ?
    axios.put(`${api_node}/api/v1/user/update`, {
      name: profile.name,
      email: profile.email,
      handle: profile.handle,
      cover_image: profile.cover_image,
      profile_image: true,
      address: user?.addr
    }) : axios.post(`${api_node}/api/v1/user`, {
      name: profile.name,
      email: profile.email,
      avatar: profile.avatar,
      db: true,
      cover_image: false,
      profile_image: true,
      handle: profile.handle,
      address: user?.addr,
    })
  }

  const handleNameChange = async (e) => {
    setName(e)
  }

  const handleUsernameChange = async (e) => {
    setUsername(e);
    setChange(true)
  }

  const handleBioChange = async (e) => {
    setBio(e);
  }

  const handleUrlChange = async (e) => {
    setUrl(e)
  }

  const handleTwitterChange = async (e) => {
    setTwitter(e)
  }

  const handleInstagramChange = async (e) => {
    setInsta(e)
  }

  const handleEmailChange = async (e) => {
    setEmail(e)
  }

  useEffect(() => {
    setName(profile.name)
    setUsername(profile.handle)
    setBio(profile.bio)
    setUrl(profile.url)
    setTwitter(profile.twitter)
    setInsta(profile.instagram)
    setEmail(profile.email)
  }, [profile])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let error = false;

    if (change) {
      const API = await axios.get(`${api_node}/api/v1/usernames/${username}`)
      const serverResponse = API.data;
  
      if (serverResponse[0]["num_unique"] !== 0) {
        error = true;
      }
    }

    if (error) {
      setErrors(true)
      return;
    } else {
      profile.db ?
      axios.put(`${api_node}/api/v1/user/update`, {
        name: name,
        email: email,
        handle: username,
        cover_image: profile.cover_image,
        profile_image: profile.profile_image,
        address: user?.addr,
        bio: bio,
        url: url,
        twitter: twitter,
        instagram: insta
      }) : axios.post(`${api_node}/api/v1/user`, {
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
        instagram: insta
      })
      
      window.location.reload()
      //history.push("/profile");
    }


  }

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
                {profile.profile_image ? <img src={`/user-images/${user?.addr}-profile.jpg`} alt="Avatar" /> : <img src={`data:image/png;base64,${profile.avatar}`} alt="Avatar" />}
                </div>
                <div className={styles.details}>
                  <div className={styles.stage}>Profile photo</div>
                  <div className={styles.file}>
                    <button
                      className={cn("button-stroke button-small", styles.button)}
                    >
                      Upload
                    </button>
                    <input className={styles.load} type="file" name="file" accept="image/*" onChange={onProfilePhotoChange} />
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
                      placeholder={profile.name ? profile.name : "Enter your name"}
                      required
                      onChange={(e) => handleNameChange(e.currentTarget.value)}
                    />
                    <TextInput
                      className={styles.field}
                      label="Username"
                      name="Handle"
                      type="text"
                      placeholder={profile.handle ? profile.handle : "Enter your Username"}
                      required
                      onChange={(e) => handleUsernameChange(e.currentTarget.value)}
                    />
                    
                    <TextInput
                      className={styles.field}
                      label="email"
                      name="Email"
                      type="text"
                      placeholder={profile.email ? profile.email : "Enter your email"}
                      required
                      onChange={(e) => handleEmailChange(e.currentTarget.value)}
                    />
                    <TextArea
                      className={styles.field}
                      label="Bio"
                      name="Bio"
                      placeholder={profile.bio ? profile.bio : "About yourself in a few words"}
                      required="required"
                      onChange={(e) => handleBioChange(e.currentTarget.value)}
                    />
                  </div>
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
                      placeholder={profile.twitter ? profile.twitter : "@twitter username"}
                      required
                      onChange = {(e) => handleTwitterChange(e.currentTarget.value)}
                    />
                    <TextInput
                      className={styles.field}
                      label="instagram"
                      name="Instagram"
                      type="text"
                      placeholder={profile.instagram ? profile.instagram : "@instagram username"}
                      required
                      onChange = {(e) => handleInstagramChange(e.currentTarget.value)}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.btns}>
                <button className={cn("button", styles.button)} onClick={(e) => handleSubmit(e)}>
                  Update Profile
                </button>
                {errors ? <div>Your username has been taken already :(</div> : <></>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
