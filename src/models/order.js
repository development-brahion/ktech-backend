import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    mobilenumber: {
      type: Number,
      required: true,
    },
    delieveryaddress: {
      name: { type: String, required: true },
      alternativemobilenumber: { type: Number, required: true },
      pincode: { type: Number, required: true },
      buildingname: { type: String, required: true },
      streetroad: { type: String, required: true },
      landmark: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      email: { type: String, required: true },
    },
    products: [
      {
        product: {
          type: mongoose.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
