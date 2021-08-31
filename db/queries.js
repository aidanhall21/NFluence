//This will initialize a Postgres database pool
//require the pg package and the pool class
const { Pool } = require("pg");
const express = require('express')

//use the config variable DATABASE_URL to connect to the database
//'postgresql://postgres:Mgoblue2@localhost:5432/NSFT'
//process.env.NODE_ENV === "production" ? process.env.DATABASE_URL : ,
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
  process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false,
})

const apiRouter = express.Router();

function getUniqueUsername(req, res) {
  const username = req.params.username;
  pool.query(
    `SELECT COUNT(id) AS num_unique FROM users WHERE handle=$1;`,
    [username],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

function getNumFollowing(req, res) {
  const account = req.params.account;

  pool.query(
    `SELECT COUNT(follower) AS following FROM followers WHERE follower=$1;`,
    [account],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

function getNumFollowers(req, res) {
  const account = req.params.account;

  pool.query(
    `SELECT COUNT(following) AS followers FROM followers WHERE following=$1;`,
    [account],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

function getFollowing(req, res) {
  const account = req.params.account;

  pool.query(
    `SELECT following FROM followers WHERE follower = $1`,
    [account],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

function getFollowers(req, res) {
  const account = req.params.account;

  pool.query(
    `SELECT follower FROM followers WHERE following = $1`,
    [account],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

function getUsers(req, res) {
  pool.query(`SELECT * FROM users`, (error, results) => {
    if (error) {
      throw error;
    }
    res.status(200).json(results.rows);
  });
}

function getUser(req, res) {
  const address = req.params.address;

  pool.query(
    `SELECT * FROM users WHERE address = $1`,
    [address],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

function getAddress(req, res) {
  const handle = req.params.handle;

  pool.query(
    `SELECT address FROM users WHERE handle = $1`,
    [handle],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

function getFollowerInfo(req, res) {
  const account = req.params.account;

  pool.query(
    `SELECT *
    FROM followers
    JOIN users
    ON users.address = followers.follower
    WHERE following = $1`,
    [account],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

function getFollowingInfo(req, res) {
  const account = req.params.account;

  pool.query(
    `SELECT *
    FROM followers
    JOIN users
    ON users.address = followers.following
    WHERE follower = $1`,
    [account],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).json(results.rows);
    }
  );
}

function createFollower(req, res) {
  const { account, followee } = req.body;

  pool.query(
    `INSERT INTO followers (follower, following) VALUES ($1, $2)`,
    [account, followee],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send("success");
    }
  );
}

function createUser(req, res) {
  const { name, email, handle, avatar, address, db, verified, cover_image, profile_image, bio, url, twitter, instagram } = req.body;

  pool.query(
    `INSERT INTO users (name, email, handle, avatar, address, db, verified, cover_image, profile_image, bio, url, twitter, instagram ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [name, email, handle, avatar, address, db, verified, cover_image, profile_image, bio, url, twitter, instagram],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(201).send("success");
    }
  );
}

function removeFollower(req, res) {
  const account = req.params.account;
  const followee = req.params.followee;

  pool.query(
    `DELETE FROM followers WHERE follower = $1 AND following = $2`,
    [account, followee],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(200).send(`${account} successfully unfollowed ${followee}`);
    }
  );
}

function updateUser(req, res) {
  const { name, email, handle, cover_image, profile_image, address, bio, url, twitter, instagram } = req.body;

  pool.query(
    `UPDATE users SET name=$1, email=$2, handle=$3, cover_image=$4, profile_image=$5, bio=$6, url=$7, twitter=$8, instagram=$9 WHERE address=$10`,
    [name, email, handle, cover_image, profile_image, bio, url, twitter, instagram, address],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(204).send("success");
    }
  );
}

function verifyUser(req, res) {
  const { verify, address } = req.body;

  pool.query(
    `UPDATE users SET verified=$1 WHERE address=$2`,
    [verify, address],
    (error, results) => {
      if (error) {
        throw error;
      }
      res.status(204).send("success");
    }
  );
}

apiRouter.get("/followers/:account", getFollowing);
apiRouter.get("/following/:account", getFollowers);
apiRouter.post("/follower", createFollower);
apiRouter.delete("/delete/:account/:followee", removeFollower);
apiRouter.get("/followers/num/:account", getNumFollowers);
apiRouter.get("/following/num/:account", getNumFollowing);
apiRouter.get("/users", getUsers);
apiRouter.get("/user/:address", getUser);
apiRouter.get("/:account/followers", getFollowerInfo);
apiRouter.get("/:account/following", getFollowingInfo);
apiRouter.get("/usernames/:username", getUniqueUsername);
apiRouter.post("/user", createUser);
apiRouter.get("/handle/:handle", getAddress);
apiRouter.put("/user/update", updateUser);
apiRouter.put("/user/verify", verifyUser)

module.exports = apiRouter

