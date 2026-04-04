import mongoose from "mongoose";

const { Schema } = mongoose;

const referralAmountSchema = new Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },

    history: [
      {
        oldAmount: Number,
        newAmount: Number,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const ReferralAmount = mongoose.model("ReferralAmount", referralAmountSchema);

export default ReferralAmount;
