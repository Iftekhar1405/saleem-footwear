const mongoose = require("mongoose");

const setSchema = new mongoose.Schema({
  size: {
    type: String,
    required: [true, "Please provide set size"],
  },
  length: {
    type: Number,
    required: [true, "Please provide set length"],
  },
});

const orderDetailSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  set: {
    type: String, // or adjust according to your specific set requirements
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    orderDetail: [orderDetailSchema],
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["Pending", "Rejected", "Confirmed"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Order", orderSchema);
