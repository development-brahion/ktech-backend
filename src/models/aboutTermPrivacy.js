import mongoose from "mongoose";
import { FileDbSchema } from "./fileDb.js";

const { Schema } = mongoose;

const aboutUsSchema = new Schema(
  {
    text: {
      type: String,
    },
    aboutBanner: {
      heading: String,
      subHeading: String,
      bgColor: String,
      textColor: String,
      bannerLogo: [FileDbSchema],
    },
  },
  { timestamps: true },
);

export const AboutUs = mongoose.model("AboutUs", aboutUsSchema);

const termsAndConditionsSchema = new Schema(
  {
    text: {
      type: String,
    },
    termConditionBanner: {
      heading: String,
      subHeading: String,
      bgColor: String,
      textColor: String,
      bannerLogo: [FileDbSchema],
    },
  },
  { timestamps: true },
);

export const TermsAndConditions = mongoose.model(
  "TermsAndConditions",
  termsAndConditionsSchema,
);

const privacyPolicySchema = new Schema(
  {
    text: {
      type: String,
    },
    pPolicyBanner: {
      heading: String,
      subHeading: String,
      bgColor: String,
      textColor: String,
      bannerLogo: [FileDbSchema],
    },
  },
  { timestamps: true },
);

export const PrivacyPolicy = mongoose.model(
  "PrivacyPolicy",
  privacyPolicySchema,
);

const whyUsSchema = new Schema(
  {
    text: {
      type: String,
    },
    whyUsBanner: {
      heading: String,
      subHeading: String,
      bgColor: String,
      textColor: String,
      bannerLogo: [FileDbSchema],
    },
  },
  { timestamps: true },
);

export const WhyUs = mongoose.model("WhyUs", whyUsSchema);
