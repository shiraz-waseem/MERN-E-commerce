const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: {
    type: Number,
    min: [0, "wrong min price"],
    max: [1000000, "wrong max price"],
  },
  discountPercentage: {
    type: Number,
    max: [100, "wrong max discount"],
  },
  rating: {
    type: Number,
    min: [0, "wrong min rating"],
    max: [5, "wrong max rating"],
    default: 0,
  },
  stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
  category: { type: String, required: true },
  thumbnail: { type: String, required: true },
  colors: { type: [mongoose.Schema.Types.Mixed] },
  sizes: { type: [mongoose.Schema.Types.Mixed] },
  highlights: { type: [String] },
  deleted: { type: Boolean, default: false },
});

const virtual = productSchema.virtual("id");
virtual.get(function () {
  return this._id; // getter
});

//setter
productSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("Product", productSchema);
