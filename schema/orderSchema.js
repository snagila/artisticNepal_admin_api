import mongoose from "mongoose";

const orderItems = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  productId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  totalPrice: {
    type: Number,
  },
  sku: {
    type: String,
  },
  availableQuantity: { type: Number },
  thumbnail: [
    {
      type: String,
    },
  ],
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    orderTotal: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },

    address: { type: String },
    orderItems: [orderItems],
  },
  { timestamps: true }
);

export default mongoose.model("order", orderSchema);
