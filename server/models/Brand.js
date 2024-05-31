const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
  label: { type: String, required: true, unique: true },
  value: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Brand", brandSchema);
