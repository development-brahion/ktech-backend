import mongoose from "mongoose";

const { Schema } = mongoose;

const roleSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref: "Courses",
  },
  days: {
    type: Number,
  },
  assignTo: [
    {
      _id: false,
      user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      assignDate: {
        type: Date,
        default: Date.now,
      },
      isvalid: {
        type: Boolean,
        default: false,
      },
      answer: {
        type: mongoose.Types.ObjectId,
        ref: "Answer",
      },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    },
  ],
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Role = mongoose.model("Role", roleSchema);

export default Role;
