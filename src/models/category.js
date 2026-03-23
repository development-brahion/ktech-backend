import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    adminId: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
  },
  { timestamps: true },
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
