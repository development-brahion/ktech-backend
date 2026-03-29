import mongoose from "mongoose";
const { Schema } = mongoose;

const ruleSchema = new Schema(
  {
    rule: String,

    role: {
      type: String,
      enum: ["Admin", "Student", "Teacher"],
      default: "Student",
    },

    status: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Rule = mongoose.model("Rule", ruleSchema);

export default Rule;
