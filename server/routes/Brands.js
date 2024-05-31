const express = require("express");
const { fetchBrands, createBrand } = require("../controllers/Brand");

const router = express.Router();

router.post("/", createBrand);
router.get("/", fetchBrands);

module.exports = router;
