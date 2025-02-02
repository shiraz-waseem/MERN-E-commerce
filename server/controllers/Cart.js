const Cart = require("../models/Cart");

const fetchCartByUser = async (req, res) => {
  // const { user } = req.query;
  const { id } = req.user;
  console.log(id, "I am outside here");

  try {
    console.log("User object in request:", req.user);
    const cartItems = await Cart.find({ user: id }).populate("product");
    console.log("Here", cartItems);
    res.status(200).json(cartItems);
  } catch (err) {
    console.log("I got in catch");
    res.status(400).json(err);
  }
};

const addToCart = async (req, res) => {
  // const cart = new Cart(req.body);
  const { id } = req.user;
  const cart = new Cart({ ...req.body, user: id });

  try {
    const doc = await cart.save();
    // replaces the product ID with the full product details in the saved cart document.
    const result = await doc.populate("product");

    console.log(result);

    res.status(201).json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const deleteFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Cart.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateCart = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Cart.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    // res.status(200).json(doc);
    const result = await doc.populate("product");
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};
module.exports = {
  fetchCartByUser,
  addToCart,
  deleteFromCart,
  updateCart,
};
