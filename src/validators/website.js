import { branches } from "../controller/website/index.js";
import {
  fileObjectJoiSchema,
  objectIdValidation,
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
};

export default joiValidation;
