const express = require("express");
const router = express.Router();
const {
  addToCart,
  fetchCartByUser,
  deleteFromCart,
  updateCart,
} = require("../controllers/Cart");

router
  .post("/", addToCart)
  .get("/", fetchCartByUser)
  .delete("/:id", deleteFromCart)
  .patch("/:id", updateCart);

module.exports = router;
