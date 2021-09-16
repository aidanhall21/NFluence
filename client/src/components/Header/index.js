import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import cn from "classnames";
import styles from "./Header.module.sass";
import Icon from "../Icon";
import Image from "../Image";
//import Notification from "./Notification";
import User from "./User";
import { useAuth } from "../../providers/AuthProvider";
import { useUser } from "../../providers/UserProvider";

const nav = [
  {
    url: "/",
    title: "Discover",
  },
  {
    url: "/faq",
    title: "How it works",
  },
  {
    url: "/upload-variants",
    title: "Create item",
  },
  {
    url: "/profile",
    title: "Profile",
  },
];

const Header = () => {
  const [visibleNav, setVisibleNav] = useState(false);
  const [search, setSearch] = useState("");
  const { loggedIn, logIn } = useAuth()
  const history = useHistory()
  const { profile } = useUser()

  return (
    <header className={styles.header}>
      <div className={cn("container", styles.container)}>
        <Link className={styles.logo} to="/">
          <Image className={styles.pic} src="/images/nsft-logo.jpeg" srcDark="/images/nsft-logo-dark.jpeg" alt="Logo" />
        </Link>
        <div className={cn(styles.wrapper, { [styles.active]: visibleNav })}>
          <nav className={styles.nav}>
            {nav.map((x, index) => x.title === 'Profile' ? (
              loggedIn ? (
              <Link
                className={styles.link}
                to={`${x.url}/${profile.handle}`}
                key={index}
              >
                {x.title}
              </Link>
            ) : (
              <Link className={styles.link} onClick={logIn} to={'/'} key={index}>
                      Log In
                      </Link>
            )) : (
              <Link
                className={styles.link}
                // activeClassName={styles.active}
                to={x.url}
                key={index}
              >
                {x.title}
              </Link>
            ))}
          </nav>
          <form
            className={styles.search}
            action=""
            onSubmit={() => {
              history.push('/search')
            }}
          >
            <input
              className={styles.input}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="Search Creators"
              required
            />
            <button className={styles.result}>
              <Icon name="search" size="20" />
            </button>
          </form>
          <Link
            className={cn("button-small", styles.button)}
            to="/upload-variants"
          >
            Upload
          </Link>
        </div>
        {/*<Notification className={styles.notification} />*/}
        <Link
          className={cn("button-small", styles.button)}
          to="/upload-variants"
        >
          Upload
        </Link>
        {!loggedIn ? <button
          className={cn("button-stroke button-small", styles.button)}
          onClick={logIn}>
          Log In
        </button> :
        <User className={styles.user} />}
        <button
          className={cn(styles.burger, { [styles.active]: visibleNav })}
          onClick={() => setVisibleNav(!visibleNav)}
        ></button>
      </div>
    </header>
  );
};

export default Header;
