import mongoose from "mongoose";

const { Schema } = mongoose;

const departmentSchema = new Schema(
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
