const User = require("../models/User");
const crypto = require("crypto");
const { sanitizeUser, sendMail } = require("../services/common");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "SECRET_KEY";

const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      console.log("I got hit");
      return res.status(400).json({ error: "Email Already Exists" });
    }

    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      // rounds, strength, algorithm
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();
        // res.status(201).json(sanitizeUser(doc));

        req.login(sanitizeUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(
              sanitizeUser(doc),
              process.env.JWT_SECRET_KEY
            );
            // res.status(201).json(sanitizeUser(doc));
            // res.status(201).json(token);
            res
              .cookie("jwt", token, {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json({ id: doc.id, role: doc.role });
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

const loginUser = async (req, res) => {
  // res.json(req.user);
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json(req.user.token);
};

const checkAuth = async (req, res) => {
  // res.json({ status: "success", user: req.user });
  console.log("In Auth API", req.user);
  console.log("I am in AUTH API");
  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

const resetPasswordRequest = async (req, res) => {
  // req.body mein email tw arha
  // const { email } = req.body.email;
  const { email } = req.body; // postman sy working
  const user = await User.findOne({ email: email });

  if (user) {
    console.log("In user");
    const token = crypto.randomBytes(48).toString("hex");
    user.resetPasswordToken = token;
    await user.save();
    // Also set token in email
    const resetPageLink =
      // "https://ecommerce-store-shiraz-waseems-projects.vercel.app/reset-password?token=" +
      "http://localhost:3000/reset-password?token=" + token + "&email=" + email;
    const subject = "reset password for e-commerce";
    const html = `<p>Click <a href='${resetPageLink}'>here</a> to Reset Password</p>`;

    // lets send email and a token in the mail body so we can verify that user has clicked right link
    if (email) {
      const response = await sendMail({ to: email, subject, html });
      res.json(response);
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(404).json({ message: "The Email Address doesn't exist!" }); // Updated error response
  }
};

const resetPassword = async (req, res) => {
  const { email, password, token } = req.body;
  const user = await User.findOne({ email: email, resetPasswordToken: token });

  if (user) {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      // rounds, strength, algorithm
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        user.password = hashedPassword;
        user.salt = salt;
        await user.save();

        // Sending email back
        const subject = "password successfully reset for e-commerce";
        const html = `<p>Successfully able to Reset Password</p>`;
        if (email) {
          const response = await sendMail({ to: email, subject, html });
          res.json(response);
        }
      }
    );
  } else {
    res.sendStatus(400);
  }
};

const logout = async (req, res) => {
  res
    .cookie("jwt", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .sendStatus(200);
};

module.exports = {
  createUser,
  loginUser,
  checkAuth,
  resetPasswordRequest,
  resetPassword,
  logout,
};
