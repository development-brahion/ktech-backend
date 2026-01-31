import mongoose from "mongoose";

const { Schema } = mongoose;

const QuerySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    mobile: {
      type: String,
      trim: true,
    },
    query: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

const Query = mongoose.model("Query", QuerySchema);

export default Query;
