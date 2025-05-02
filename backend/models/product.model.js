const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    rate: {
      average: { type: Number, default: 0 },
      usersCount: { type: Number, default: 0 },
      ratings: [
        {
          userID: { type: mongoose.Schema.Types.ObjectId },
          rating: { type: Number, min: 1, max: 5 },
        },
      ],
    },
    stock: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
    },
    soldOut: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
