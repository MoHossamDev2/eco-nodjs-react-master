const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userID: { type: mongoose.Schema.Types.ObjectId, required: true },
  products: [
    {
      productID: { type: mongoose.Schema.Types.ObjectId, required: true },
      count: { type: Number, required: true, default: 1 },
    },
  ],
  status: { type: String, default: "pending" },
  orderDate: { type: Date, required: true, default: Date.now },
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model("Order", orderSchema);
