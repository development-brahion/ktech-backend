import { branches } from "../controller/website/index.js";
import {
  fileObjectJoiSchema,
  objectIdValidation,
  optionalArrayWithMinimumLength,
  optionalFileObjectJoiSchema,
  optionalString,
  requiredArrayWithMinimumLength,
  requiredBoolean,
  requiredNumber,
  requiredObject,
  requiredString,
  urlValidation,
} from "../utils/joiValidationDataType.js";
const joiValidation = {
  "/home": {
    banner: requiredObject({
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
      imageUrl: urlValidation("Banner Image"),
      bgColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      bannerLogo: requiredArrayWithMinimumLength(fileObjectJoiSchema(), 1),
    }),
    becomeInstructor: {
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
      imageUrl: urlValidation("instructor Image"),
      bgColor: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    allCoursesHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
    over50Courses: {
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    howItWorks: {
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
      imageUrl: urlValidation("work Image"),
      bgColor: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    testimonial: {
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    blogs: {
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
  },
  languages: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/update": {
      _id: objectIdValidation("id"),
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/enable-disable": {
      _id: objectIdValidation("id"),
      status: requiredBoolean(),
    },
  },
  category: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/update": {
      _id: objectIdValidation("id"),
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/enable-disable": {
      _id: objectIdValidation("id"),
      status: requiredBoolean(),
    },
  },
  blogs: {
    "/create": {
      title: requiredString(1, Number.MAX_SAFE_INTEGER),
      shortDescription: requiredString(1, Number.MAX_SAFE_INTEGER),
      description: requiredString(1, Number.MAX_SAFE_INTEGER),
      thumbnailImage: fileObjectJoiSchema(),
      mainImageUrl: fileObjectJoiSchema(),
      language: requiredArrayWithMinimumLength(
        objectIdValidation("language id"),
        1,
      ),
      category: requiredArrayWithMinimumLength(
        objectIdValidation("category id"),
        1,
      ),
    },
    "/update": {
      _id: objectIdValidation("id"),
      title: requiredString(1, Number.MAX_SAFE_INTEGER),
      shortDescription: requiredString(1, Number.MAX_SAFE_INTEGER),
      description: requiredString(1, Number.MAX_SAFE_INTEGER),
      thumbnailImage: fileObjectJoiSchema(),
      mainImageUrl: fileObjectJoiSchema(),
      language: requiredArrayWithMinimumLength(
        objectIdValidation("language id"),
        1,
      ),
      category: requiredArrayWithMinimumLength(
        objectIdValidation("category id"),
        1,
      ),
    },
    "/enable-disable": {
      _id: objectIdValidation("id"),
      status: requiredBoolean(),
    },
  },
  branches: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
      state: requiredString(1, Number.MAX_SAFE_INTEGER),
      city: requiredString(1, Number.MAX_SAFE_INTEGER),
      country: requiredString(1, Number.MAX_SAFE_INTEGER),
      address: requiredString(1, Number.MAX_SAFE_INTEGER),
      pincode: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/update": {
      _id: objectIdValidation("id"),
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
      state: requiredString(1, Number.MAX_SAFE_INTEGER),
      city: requiredString(1, Number.MAX_SAFE_INTEGER),
      country: requiredString(1, Number.MAX_SAFE_INTEGER),
      address: requiredString(1, Number.MAX_SAFE_INTEGER),
      pincode: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/enable-disable": {
      _id: objectIdValidation("id"),
      status: requiredBoolean(),
    },
  },
  testimonials: {
    "/create": {
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
      imageUrl: fileObjectJoiSchema(),
      rating: requiredNumber(1, 5),
      text: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/update": {
      _id: objectIdValidation("id"),
      name: requiredString(1, Number.MAX_SAFE_INTEGER),
      imageUrl: fileObjectJoiSchema(),
      rating: requiredNumber(1, 5),
      text: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    "/enable-disable": {
      _id: objectIdValidation("id"),
      status: requiredBoolean(),
    },
  },
  "/configs": {
    companyName: requiredString(1, Number.MAX_SAFE_INTEGER),
    facebook: optionalString(0, Number.MAX_SAFE_INTEGER),
    twitter: optionalString(0, Number.MAX_SAFE_INTEGER),
    instagram: optionalString(0, Number.MAX_SAFE_INTEGER),
    youtube: optionalString(0, Number.MAX_SAFE_INTEGER),
    websiteName: requiredString(1, Number.MAX_SAFE_INTEGER),
    companyPhoneNo: requiredString(1, Number.MAX_SAFE_INTEGER),
    companyAddress: requiredString(1, Number.MAX_SAFE_INTEGER),
    companyLogo: requiredArrayWithMinimumLength(fileObjectJoiSchema(), 1),
  },
  "/course-faq": {
    text: requiredString(1, Number.MAX_SAFE_INTEGER),
    courseFaqBanner: {
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
      bgColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      textColor: requiredString(1, Number.MAX_SAFE_INTEGER),
    },
    courseFaq: requiredArrayWithMinimumLength(
      requiredObject({
        question: requiredString(1, Number.MAX_SAFE_INTEGER),
        answer: requiredString(1, Number.MAX_SAFE_INTEGER),
      }),
      1,
    ),
  },
  "/about-us": {
    text: requiredString(1, Number.MAX_SAFE_INTEGER),
    aboutBanner: requiredObject({
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
      bgColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      textColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      bannerLogo: requiredArrayWithMinimumLength(fileObjectJoiSchema(), 1),
    }),
  },
  "/terms-and-conditions": {
    text: requiredString(1, Number.MAX_SAFE_INTEGER),
    termConditionBanner: requiredObject({
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
      bgColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      textColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      bannerLogo: requiredArrayWithMinimumLength(fileObjectJoiSchema(), 1),
    }),
  },
  "/privacy-policy": {
    text: requiredString(1, Number.MAX_SAFE_INTEGER),
    pPolicyBanner: requiredObject({
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
      bgColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      textColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      bannerLogo: requiredArrayWithMinimumLength(fileObjectJoiSchema(), 1),
    }),
  },
  "/why-us": {
    text: requiredString(1, Number.MAX_SAFE_INTEGER),
    whyUsBanner: requiredObject({
      heading: requiredString(1, Number.MAX_SAFE_INTEGER),
      subHeading: requiredString(1, Number.MAX_SAFE_INTEGER),
      bgColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      textColor: requiredString(1, Number.MAX_SAFE_INTEGER),
      bannerLogo: requiredArrayWithMinimumLength(fileObjectJoiSchema(), 1),
    }),
  },
  "/configs/templates": {
    templates: requiredObject({
      certificate: optionalArrayWithMinimumLength(
        optionalFileObjectJoiSchema(),
      ),
      idcard: optionalArrayWithMinimumLength(optionalFileObjectJoiSchema()),
      hallticket: optionalArrayWithMinimumLength(optionalFileObjectJoiSchema()),
      Admission: optionalArrayWithMinimumLength(optionalFileObjectJoiSchema()),
      fees: optionalArrayWithMinimumLength(optionalFileObjectJoiSchema()),
      marksheet: optionalArrayWithMinimumLength(optionalFileObjectJoiSchema()),
      trainingCenter: optionalArrayWithMinimumLength(
        optionalFileObjectJoiSchema(),
      ),
      typing: optionalArrayWithMinimumLength(optionalFileObjectJoiSchema()),
    }),
  },
};

export default joiValidation;
