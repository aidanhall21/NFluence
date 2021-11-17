const express = require("express");
const aws = require('aws-sdk');
const path = require("path");
const multer = require('multer')
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const errorhandler = require("errorhandler");
require('dotenv').config({path: __dirname+'/.env.local'})

let port = 5000

const app = express();
const apiRouter = require('./db/queries');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(errorhandler());

app.use('/api/v1', apiRouter)

//update these paths
const serveReactApp = () => {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
};

app.engine('html', require('ejs').renderFile);

if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT || 5000
  serveReactApp();
}

app.listen(port, () => {
  console.log(`listening on PORT ${port}`);
});

const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
console.log(S3_BUCKET)
aws.config.region = 'us-east-2';

app.get('/api/v1/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  console.log(fileName)
  const fileType = req.query['file-type'];
  console.log(fileType)
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err)
      return res.end();
    }
    const returnData = {
      signedRequest: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    };
    res.write(JSON.stringify(returnData));
    res.end();
  });
});
