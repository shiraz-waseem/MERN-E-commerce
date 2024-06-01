const Cart = require("../models/Cart");

// Cart collection to find all cart items that belong to the specified user.
// .populate('product') method replaces the product field in each cart item with the corresponding Product document.
// This means instead of just having a product ID, the resulting cart items will include the full product details.

const fetchCartByUser = async (req, res) => {
  // extracts the user parameter from the query string of the incoming request. For example,
  //   if the request URL is /cart?user=123, user will be 123.

  const { user } = req.query;

  try {
    const cartItems = await Cart.find({ user: user }).populate("product");
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(400).json(err);
  }
};

const addToCart = async (req, res) => {
  const cart = new Cart(req.body);
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
