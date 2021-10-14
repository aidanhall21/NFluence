const stripe = require('stripe')('sk_test_51JhdSpJoN02dbjVUeDlh5MPtsO9IQ1Ru0Y4AFsj3mi5A3imPRQbuKZVJtQrMuwVbJ6VtenKuhfD1ayjW8QKixakQ00ZW2DtAzJ')
const express = require("express");
const aws = require('aws-sdk');
const path = require("path");
const multer = require('multer')
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const errorhandler = require("errorhandler");
require('dotenv').config()

let port = 5000

const app = express();
const apiRouter = require('./db/queries');
const bodyParser = require('body-parser');
const endpointSecret = 'whsec_d19Ji0uVjncsdewclLgmB9qLffiQeFVQ';

const MY_DOMAIN = 'http://localhost:3000/profile-edit';

app.use(cors());
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(errorhandler());

app.use('/api/v1', apiRouter)

const calculateOrderAmount = items => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client
  console.log(items)
  return items;
};

app.post('/api/v1/create-checkout-session', async (req, res) => {
  const deposit = req.query.deposit;
  console.log(deposit)
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // TODO: replace this with the `price` of the product you want to sell
        price: 'price_1Jhkb8JoN02dbjVUPf1L3RN7',
        quantity: deposit,
      },
    ],
    payment_method_types: [
      'card',
    ],
    mode: 'payment',
    success_url: `${MY_DOMAIN}?success=true`,
    cancel_url: `${MY_DOMAIN}?canceled=true`,
  });

  res.header("Access-Control-Allow-Origin", "*")

  res.redirect(303, session.url)
})

app.post('/api/v1/create-payment-intent', async (req, res) => {
  const { items } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "usd"
  });

  res.send({
    clientSecret: paymentIntent.client_secret
  })
})

const fulfillOrder = (session) => {
  // TODO: fill me in
  console.log("Fulfilling order", session);
}

app.post('/api/v1/webhook', bodyParser.raw({type: 'application/json'}), (request, response) => {
  const event = request.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!');
      console.log(paymentIntent)
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      console.log('PaymentMethod was attached to a Customer!');
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.json({received: true});
});

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

app.engine('html', require('ejs').renderFile);

if (process.env.NODE_ENV === 'production') {
  port = process.env.PORT || 5000
  serveReactApp();
}

app.listen(port, () => {
  console.log(`listening on PORT ${port}`);
});

const S3_BUCKET = process.env.S3_BUCKET;
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

  console.log(s3Params)

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
