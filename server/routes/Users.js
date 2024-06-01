const express = require("express");
const router = express.Router();
const { fetchUserById, updateUser } = require("../controllers/User");

router.get("/:id", fetchUserById);
router.patch("/:id", updateUser);

module.exports = router;
