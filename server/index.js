const express = require("express");
const app = express();
require("./db/conn");
require("dotenv").config();
const cors = require("cors");
const productsRouter = require("./routes/Products");
const categoriesRouter = require("./routes/Categories");
const brandsRouter = require("./routes/Brands");
const usersRouter = require("./routes/Users");
const authRouter = require("./routes/Auth");
const cartRouter = require("./routes/Cart");
const ordersRouter = require("./routes/Order");
const session = require("express-session");
const passport = require("passport");
const User = require("./models/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const { isAuth, sanitizeUser, cookieExtractor } = require("./services/common");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const path = require("path");
const { Order } = require("./models/Order");
// const nodemailer = require("nodemailer");

// //

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // Use `true` for port 465, `false` for all other ports
//   auth: {
//     user: "shirazwaseemwork@gmail.com",
//     pass: process.env.MAIL_PASSWORD,
//   },
// });

// TODO: we will capture actual order after deploying out server live on public URL
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.WEBHOOK_ENDPOINT;

// app.post(
//   "/webhook",
//   express.raw({ type: "application/json" }),
//   async (request, response) => {
//     const sig = request.headers["stripe-signature"];

//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//     } catch (err) {
//       response.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     // Handle the event
//     switch (event.type) {
//       case "payment_intent.succeeded":
//         const paymentIntentSucceeded = event.data.object;
//         // Then define and call a function to handle the event payment_intent.succeeded

//         const order = await Order.findById(
//           paymentIntentSucceeded.metadata.orderId
//         );
//         order.paymentStatus = "received";
//         await order.save();
//         console.log("Payment successful");

//         break;
//       // ... handle other event types
//       default:
//         console.log(`Unhandled event type ${event.type}`);
//     }

//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
//   }
// );

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded

        const order = await Order.findById(
          paymentIntentSucceeded.metadata.orderId
        );
        order.paymentStatus = "received";
        await order.save();
        console.log("Payment successful");

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

//
const SECRET_KEY = process.env.JWT_SECRET_KEY;
// JWT options
const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

const port = process.env.PORT;
app.use(express.json()); // to parse req.body
// app.use(express.static("build"));
app.use(express.static(path.resolve(__dirname, "build")));
// console.log(path.resolve(__dirname, "build")); E:\Another Ecommerce\ecommerce\MERN-E-commerce\server\build
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // store: new SQLiteStore({ db: "sessions.db", dir: "./var/db" }),
  })
);

app.use(passport.authenticate("session"));

app.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
app.use(express.urlencoded({ extended: false }));

//APIS
app.use("/products", isAuth(), productsRouter);
// we can also use JWT token for client-only auth
app.use("/categories", isAuth(), categoriesRouter);
app.use("/brands", isAuth(), brandsRouter);
app.use("/users", isAuth(), usersRouter);
app.use("/auth", authRouter);
app.use("/cart", isAuth(), cartRouter);
app.use("/orders", isAuth(), ordersRouter);
app.get("*", (req, res) => res.sendFile(path.resolve("build", "index.html")));

// app.get("/", (req, res) => {
//   res.json({ status: "success" });
// });

// app.post("/mail", async (req, res) => {
//   const { to } = req.body;
//   const info = await transporter.sendMail({
//     from: "E-commerce Store <shirazwaseem@gmail.com>", // sender address
//     to: to, // list of receivers
//     subject: "Hello ✔", // Subject line
//     text: "Hello world?", // plain text body
//     html: "<b>Hello world?</b>", // html body
//   });

//   res.json(info);
// });

// passport strategies

passport.use(
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    try {
      const user = await User.findOne({ email: email }).exec();
      if (!user) {
        done(null, false, { message: "invalid credentials" }); // for safety
      }

      crypto.pbkdf2(
        password,
        user.salt, // user ka
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          // done(null, sanitizeUser(user));
          const token = jwt.sign(sanitizeUser(user), SECRET_KEY);
          done(null, { id: user.id, role: user.role, token }); // this lines sends to serializer
        }
      );
    } catch (err) {
      console.log(err);
      done(err);
    }
    // return done(null, user);
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      if (user) {
        return done(null, sanitizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// this creates session variable req.user on being called from callbacks. Jab ap first time login krte
passport.serializeUser(function (user, cb) {
  // console.log("serialize", user); // it returnd a to z everything about user so
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user.role,
    });
  });
});

// Whenever you do authenticate request krte hu tw us mein ye wapis sy session variable us user ko populate krne mein kaam
passport.deserializeUser(function (user, cb) {
  console.log("de-serialize", user); // returns id and role only
  process.nextTick(function () {
    return cb(null, user);
  });
});

// payments

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// const calculateOrderAmount = (items) => {
//   // Replace this constant with a calculation of the order's amount
//   // Calculate the order total on the server to prevent
//   // people from directly manipulating the amount on the client
//   return 1400;
// };

app.post("/create-payment-intent", async (req, res) => {
  // const { items } = req.body;
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    // amount: calculateOrderAmount(items),
    amount: totalAmount * 100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// Webhook

app.listen(port, () => {
  console.log(`listening to port no ${port}`);
});
