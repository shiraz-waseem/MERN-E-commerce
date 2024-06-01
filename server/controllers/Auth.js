const User = require("../models/User");

const createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const doc = await user.save();
    res.status(201).json({ id: doc.id, role: doc.role });
    // res.status(201).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email, // The findOne method expects an object as its argument
    }).exec();
    console.log({ user });
    // TODO: this is just temporary, we will use strong password auth

    if (!user) {
      res.status(401).json({ message: "no such user email" });
    } else if (user.password === req.body.password) {
      // res.status(200).json({
      //   id: user.id,
      //   email: user.email,
      //   name: user.name,
      //   addresses: user.addresses,
      // });

      res.status(200).json({ id: user.id, role: user.role });
    } else {
      res.status(401).json({ message: "invalid credentials" });
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  createUser,
  loginUser,
};
