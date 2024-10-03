const express = require("express");
const router = express.Router();
const {
  createProduct,
  fetchAllProducts,
  fetchProductById,
  updateProduct,
} = require("../controllers/Product");

router.post("", createProduct);
router.get("/", fetchAllProducts);
router.get("/:id", fetchProductById);
router.patch("/:id", updateProduct);

module.exports = router;
