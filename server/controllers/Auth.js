const User = require("../models/User");
const crypto = require("crypto");
const { sanitizeUser } = require("../services/common");

const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    // const doc = await user.save();
    // res.status(201).json({ id: doc.id, role: doc.role });
    // res.status(201).json(doc);
    // Hash password

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
            res.status(201).json(sanitizeUser(doc));
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

const loginUser = async (req, res) => {
  // try {
  //   const user = await User.findOne({
  //     email: req.body.email, // The findOne method expects an object as its argument
  //   }).exec();
  //   console.log({ user });
  //   // TODO: this is just temporary, we will use strong password auth
  //   if (!user) {
  //     res.status(401).json({ message: "no such user email" });
  //   } else if (user.password === req.body.password) {
  //     // res.status(200).json({
  //     //   id: user.id,
  //     //   email: user.email,
  //     //   name: user.name,
  //     //   addresses: user.addresses,
  //     // });
  //     res.status(200).json({ id: user.id, role: user.role });
  //   } else {
  //     res.status(401).json({ message: "invalid credentials" });
  //   }
  // } catch (err) {
  //   res.status(400).json(err);
  // }

  res.json(req.user);
};

const checkUser = async (req, res) => {
  res.json({ status: "success", user: req.user });
};

module.exports = {
  createUser,
  loginUser,
  checkUser,
};
