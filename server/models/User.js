const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: Buffer, required: true },
  role: { type: String, required: true, default: "user" },
  addresses: { type: [mongoose.Schema.Types.Mixed] },
  // TODO:  We can make a separate Schema for this warna Mix datatype
  name: { type: String },
  // orders: { type: [mongoose.Schema.Types.Mixed] },
  salt: Buffer,
});

const virtual = userSchema.virtual("id");
virtual.get(function () {
  return this._id; // getter
});

//setter
userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

module.exports = mongoose.model("User", userSchema); // database mein users
