import {
  fileObjectJoiSchema,
  objectIdValidation,
  requiredArrayWithMinimumLength,
  requiredBoolean,
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
};

export default joiValidation;
