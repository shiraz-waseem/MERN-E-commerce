const Order = require("../models/Order");

const fetchOrdersByUser = async (req, res) => {
  // extracts the user parameter from the query string of the incoming request. For example,
  //   if the request URL is /order?user=123, user will be 123.

  const { user } = req.query;

  try {
    const orders = await Order.find({ user: user });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createOrder = async (req, res) => {
  const order = new Order(req.body);
  try {
    const doc = await order.save();
    console.log(doc);
    res.status(201).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Order.findByIdAndDelete(id);
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

const updateOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const doc = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};
module.exports = {
  fetchOrdersByUser,
  createOrder,
  deleteOrder,
  updateOrder,
};
