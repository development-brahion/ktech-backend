import mongoose from "mongoose";

const { Schema } = mongoose;

const referralAmountSchema = new Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const ReferralAmount = mongoose.model("ReferralAmount", referralAmountSchema);

export default ReferralAmount;
