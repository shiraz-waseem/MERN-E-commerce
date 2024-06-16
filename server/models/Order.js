const mongoose = require("mongoose");

const paymentMethods = {
  values: ["card", "cash"],
  message: "enum validator failed for payment Methods",
};

const orderSchema = new mongoose.Schema(
  {
    items: { type: [mongoose.Schema.Types.Mixed], required: true },
    totalAmount: { type: Number },
    totalItems: { type: Number },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // paymentMethod: { type: String, required: true },
    paymentMethod: { type: String, required: true, enum: paymentMethods },
    paymentStatus: { type: String, default: "pending" },
    status: { type: String, default: "pending" },
    selectedAddress: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

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
