const express = require("express");
const { createCategory, fetchCategories } = require("../controllers/Category");
const router = express.Router();

router.post("/", createCategory);
router.get("/", fetchCategories);

module.exports = router;
