const express = require("express");
const app = express();
require("./db/conn");
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

//
const SECRET_KEY = "SECRET_KEY"; // token created
// JWT options
const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY; // TODO: should not be in code we will put in env;

//
const port = 8000;
app.use(express.json()); // to parse req.body
app.use(express.static("build"));
app.use(cookieParser()); // client sy wali cookies easily prh skta

app.use(
  session({
    secret: "keyboard cat",
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

// app.get("/", (req, res) => {
//   res.json({ status: "success" });
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
          done(null, { token }); // this lines sends to serializer
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
  console.log("serialize", user); // it returnd a to z everything about user so
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

// Iske baad kisi route ko use krne ke lia you have to be login
// function isAuth(req, res, done) {
//   if (req.user) {
//     // agar user ha on server
//     done();
//   } else {
//     res.send(401);
//   }
// }

app.listen(port, () => {
  console.log(`listening to port no ${port}`);
});
