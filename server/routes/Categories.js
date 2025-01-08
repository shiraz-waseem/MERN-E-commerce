const express = require("express");
const {
  createCategory,
  fetchCategories,
  fetchCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/Category");
const router = express.Router();

router.post("/", createCategory);
router.get("/", fetchCategories);
router.get("/:id", fetchCategoryById);
router.patch("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
