const Order = require("../models/Order");

const fetchOrdersByUser = async (req, res) => {
  // extracts the user parameter from the query string of the incoming request. For example,
  //   if the request URL is /order?user=123, user will be 123.

  const { userId } = req.query;

  try {
    const orders = await Order.find({ user: userId });
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

// fetchAllOrders
// Orders ke Page py table ki format mein
const fetchAllOrders = async (req, res) => {
  let query = Order.find({ deleted: { $ne: true } });
  let totalOrdersQuery = Order.find({ deleted: { $ne: true } });

  if (req.query._sort && req.query._order) {
    query = query.sort({ [req.query._sort]: req.query._order });
  }

  // Total Counts for pagination
  const totalDocs = await totalOrdersQuery.count().exec();
  console.log({ totalDocs });

  // pagination
  if (req.query._page && req.query._limit) {
    const pageSize = req.query._limit;
    const page = req.query._page;

    query = query.skip(pageSize * (page - 1)).limit(pageSize); // Formula phela page nothing skip
  }

  try {
    const docs = await query.exec(); // execute
    res.set("X-Total-Count", totalDocs); // Header ka naam and value to give for header
    res.status(200).json(docs);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  fetchOrdersByUser,
  createOrder,
  deleteOrder,
  updateOrder,
  fetchAllOrders,
};
