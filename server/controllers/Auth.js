const User = require("../models/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "SECRET_KEY";

const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
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
            const token = jwt.sign(sanitizeUser(doc), SECRET_KEY);
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

  if (req.user) {
    res.json(req.user);
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  createUser,
  loginUser,
  checkAuth,
};
