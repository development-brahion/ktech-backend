import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    email: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    expiretoken: {
      type: Date,
    },
    phoneNo: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: ["Superadmin", "Admin", "Student", "Teacher"],
      default: "Student",
    },
    password: {
      type: String,
    },
    originalPassword: {
      type: String,
    },
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
    },
    designation: {
      type: mongoose.Types.ObjectId,
      ref: "Designation",
    },
    dateOfBirth: {
      type: Date,
    },
    dateOfJoining: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      unique: true,
    },
    salary: {
      type: Number,
      default: 0,
    },
    profilephoto: [
      FileDbSchema
    ],
    Roleid: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Role",
      },
    ],
    Goalid: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Goal",
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
