import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";

const { Schema } = mongoose;

const homeSchema = new Schema(
  {
    banner: {
      heading: String,
      subHeading: String,
      imageUrl: String,
      bgColor: String,
      bannerLogo: [FileDbSchema],
    },
    becomeInstructor: {
      heading: String,
      subHeading: String,
      imageUrl: String,
      bgColor: String,
    },
    allCoursesHeading: String,
    over50Courses: {
      heading: String,
      subHeading: String,
    },
    howItWorks: {
      heading: String,
      subHeading: String,
      imageUrl: String,
      bgColor: String,
    },
    testimonial: {
      heading: String,
      subHeading: String,
    },
    blogs: {
      heading: String,
      subHeading: String,
    },
  },
  { timestamps: true }
);

const Home = mongoose.model("Home", homeSchema);

export default Home;
