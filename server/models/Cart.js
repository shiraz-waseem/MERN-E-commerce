const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const virtual = cartSchema.virtual("id");
virtual.get(function () {
  return this._id; // getter
});

//setter
cartSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Cart", cartSchema);
