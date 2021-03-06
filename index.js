const express = require("express");
const aws = require('aws-sdk');
const path = require("path");
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const errorhandler = require("errorhandler");
require('dotenv').config({path: __dirname+'/.env.local'})

let port = 5005

const app = express();
const apiRouter = require('./db/queries');

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(errorhandler());

app.use('/api/v1', apiRouter)
const S3_BUCKET = process.env.S3_BUCKET;

aws.config.getCredentials(function(err) {
  if (err) console.log(err.stack);
  // credentials not loaded
  else {
    console.log('');
  }
});



aws.config.region = 'us-east-2';

//console.log(S3_BUCKET, process.env.AWS_ACCESS_KEY_ID)

app.get('/api/v1/sign-s3', (req, res) => {
  const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  };
  console.log(fileName, fileType)

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
