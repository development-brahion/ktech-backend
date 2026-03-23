import mongoose from "mongoose";

const { Schema } = mongoose;

const designationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    salary: {
      type: Number,
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

const Designation = mongoose.model("Designation", designationSchema);

export default Designation;
