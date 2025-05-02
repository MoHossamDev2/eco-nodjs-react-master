const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    cart: [
      {
        productID: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        count: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
