const express = require("express");
const path = require("path");
const multer = require('multer')
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const errorhandler = require("errorhandler");

let port = 5000

const app = express();
const apiRouter = require('./db/queries')

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(errorhandler());

app.use('/api/v1', apiRouter)

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './client/public/user-images')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

let upload = multer({ storage: storage }).single('file')

app.post('/api/v1/upload', function(req, res) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.log(err)
      return res.status(500).json(err)
    } else if (err) {
      console.log(err)
      return res.status(500).json(err)
    }
    console.log(req.file)
    return res.status(200).send(req.file)
  })
})

//update these paths
const serveReactApp = () => {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "client/build/index.html"));
  });
};

if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT || 5000
  serveReactApp();
}

app.listen(port, () => {
  console.log(`listening on PORT ${port}`);
});
