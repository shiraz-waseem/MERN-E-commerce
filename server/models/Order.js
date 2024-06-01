const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: { type: [mongoose.Schema.Types.Mixed], required: true },
  totalAmount: { type: Number },
  totalItems: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //TODO:  we can add enum types, enum - limit, ham sirf cash card rkh skty later krlein gy
  paymentMethod: { type: String, required: true },
  status: { type: String, default: "pending" },
  selectedAddress: { type: mongoose.Schema.Types.Mixed, required: true },
});

const virtual = orderSchema.virtual("id");
virtual.get(function () {
  return this._id; // getter
});

//setter
orderSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Order", orderSchema);
