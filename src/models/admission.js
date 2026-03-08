import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";

const { Schema } = mongoose;

const admissionSchema = new Schema(
  {
    name: String,
    email: String,
    phoneNo: Number,
    aadharNo: String,

    course: {
      type: mongoose.Types.ObjectId,
      ref: "Courses",
    },

    admissionSource: {
      type: mongoose.Types.ObjectId,
      ref: "Source",
    },

    address: String,
    addressProof: String,

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    admissionSession: String,
    admissionNo: String,

    rollNo: {
      type: String,
      unique: true,
    },

    courseDuration: Number,

    category: {
      type: String,
      enum: ["General", "OBC", "SC", "ST"],
    },

    religion: {
      type: String,
      enum: ["Hindu", "Sikh", "Christian", "Muslim", "Other"],
    },

    qualification: String,

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Other"],
    },

    photo: String,
    idProof: String,

    fatherName: String,
    motherName: String,
    fatherOccupation: String,
    fatherPhoneNo: Number,
    motherPhoneNo: Number,

    loginEmail: String,
    loginPassword: String,

    dateOfBirth: Date,

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },

    fee: Number,

    userImage: [FileDbSchema],

    discountRate: {
      type: String,
      enum: ["Amount", "Percent"],
    },

    discountAmount: {
      type: Number,
      default: 0,
    },

    totalFees: {
      type: Number,
      default: 0,
    },

    feesReceived: {
      type: Number,
      default: 0,
    },

    balance: {
      type: Number,
      default: 0,
    },

    remarks: String,

    batch: {
      type: mongoose.Types.ObjectId,
      ref: "Batch",
    },

    installments: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Installment",
      },
    ],

    plan: {
      type: mongoose.Types.ObjectId,
      ref: "CoursePlans",
    },

    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    hallticket: {
      type: mongoose.Types.ObjectId,
      ref: "hallTicket",
    },

    examType: {
      type: String,
      enum: ["Online", "Offline"],
    },

    certistatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
    },

    result: {
      type: mongoose.Types.ObjectId,
      ref: "Answer",
    },

    signature: [FileDbSchema],

    ispassed: {
      type: Boolean,
      default: false,
    },

    attemptedexam: {
      type: Boolean,
      default: false,
    },

    hallticketstatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
    },

    surname: String,

    incentive: {
      type: Number,
      default: 0,
    },

    teacherid: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: ["New-Admission", "Re-Admission"],
    },

    referredBy: String,
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true },
);

const Admission = mongoose.model("Admission", admissionSchema);

export default Admission;
