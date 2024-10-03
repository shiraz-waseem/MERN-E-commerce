const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

const { sendMail, invoiceTemplate } = require("../services/common");

const fetchOrdersByUser = async (req, res) => {
  // extracts the user parameter from the query string of the incoming request. For example,
  //   if the request URL is /order?user=123, user will be 123.

  // const { userId } = req.query;
  const { id } = req.user;

  try {
    const orders = await Order.find({ user: id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json(err);
  }
};

// const createOrder = async (req, res) => {
//   console.log("I am here");
//   const order = new Order(req.body);

//   // here we have to update stocks;
//   for (let item of order.items) {
//     let product = await Product.findOne({ _id: item.product.id });
//     // We dont have any decrement operator but increment ka ha. Mongoose increment
//     product.$inc("stock", -1 * item.quantity);
//     // for optimum performance we should make inventory outside of product.
//     await product.save();
//   }

//   try {
//     const doc = await order.save();
//     const user = await User.findById(order.user); // order ke model mein user ha
//     // we can use await for this also. Here we are using directly taky non blocking rhy frontend py bhi response ata placed successfully sentmail time leta so we want background mein chala ye
//     sendMail({
//       to: user.email,
//       html: invoiceTemplate(order),
//       subject: "Order Received",
//     });
//     console.log(doc);
//     res.status(201).json(doc);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json(err);
//   }
// };

const createOrder = async (req, res) => {
  const order = new Order(req.body);

  try {
    // Iterate through the items and check stock before proceeding
    for (let item of order.items) {
      let product = await Product.findOne({ _id: item.product.id });

      // Check if there is enough stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `There is not much stock left for ${product.title}. Please choose another item or reduce quantity.`,
        });
      }

      // Decrement stock (use $inc for atomic updates in MongoDB)
      product.stock -= item.quantity;
      await product.save();
    }

    // Save the order after stock validation
    const doc = await order.save();
    const user = await User.findById(order.user);

    // Send email asynchronously (non-blocking)
    sendMail({
      to: user.email,
      html: invoiceTemplate(order),
      subject: "Order Received",
    });

    res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    res.status(400).json({
      message: "Order creation failed. Please try again.",
      error: err,
    });
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
