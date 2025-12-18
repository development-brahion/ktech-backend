import mongoose from "mongoose";

const { Schema } = mongoose;

const attendanceSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent", "Leave"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      default: null,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },
  },
  { timestamps: true }
);

/**
 * Pre-validation hook
 * - Student → course & batch required
 * - Teacher → course & batch removed
 */
attendanceSchema.pre("validate", async function (next) {
  try {
    let role;

    // If user is populated
    if (this.user && typeof this.user === "object" && this.user.role) {
      role = this.user.role;
    } else {
      // Fetch role from DB
      const user = await mongoose
        .model("User")
        .findById(this.user)
        .select("role");

      if (!user) {
        return next(new Error("User not found."));
      }

      role = user.role;
    }

    if (role === "Student") {
      if (!this.course || !this.batch) {
        return next(
          new Error("Course and batch are required for students.")
        );
      }
    }

    if (role === "Teacher") {
      this.course = undefined;
      this.batch = undefined;
    }

    next();
  } catch (err) {
    next(err);
  }
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
