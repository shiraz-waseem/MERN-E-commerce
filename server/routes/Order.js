const express = require("express");
const router = express.Router();
const {
  createOrder,
  fetchOrdersByUser,
  deleteOrder,
  updateOrder,
} = require("../controllers/Order");

router
  .post("/", createOrder)
  .get("/", fetchOrdersByUser)
  .delete("/:id", deleteOrder)
  .patch("/:id", updateOrder);

module.exports = router;
