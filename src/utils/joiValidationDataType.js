import Joi from "joi";
import moment from "moment";
import { STRONG_PASSWORD_ERROR } from "./constantsMessage.js";
import { PASSWORD_REGEX } from "./constants.js";

export const requiredString = (min, max) =>
  Joi.string().trim().min(min).max(max).required();
export const optionalString = (min, max) =>
  Joi.string().trim().min(min).max(max).optional().allow("", null);

export const emailValidation = () =>
  Joi.string().trim().email().required().messages({
    "string.email": "Please enter a valid email address",
  });

export const passwordValidation = (min = 8, max = 30) =>
  Joi.string()
    .trim()
    .required()
    .min(min)
    .max(max)
    .pattern(PASSWORD_REGEX)
    .disallow("")
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.min": `Password must be at least ${min} characters`,
      "string.max": `Password must be at most ${max} characters`,
      "string.pattern.base": STRONG_PASSWORD_ERROR,
      "any.disallow": "Password is required",
    });

export const confirmPasswordValidation = () =>
  Joi.string()
    .trim()
    .when("password", {
      is: Joi.string().min(1),
      then: Joi.valid(Joi.ref("password")).required().messages({
        "any.only": "Confirm password does not match password",
        "any.required": "Please confirm your password",
      }),
      otherwise: Joi.optional().allow(""),
    });

export const requiredNumber = (min, max) =>
  Joi.number().min(min).max(max).required();
export const optionalNumber = (min, max) =>
  Joi.number().min(min).max(max).optional().allow(null);

export const requiredBoolean = () => Joi.boolean().required();
export const optionalBoolean = () => Joi.boolean().optional().allow(null, "");

export const requiredArray = (itemsSchema, min = 1, max = undefined) =>
  Joi.array()
    .items(itemsSchema)
    .min(min)
    .max(max || Number.MAX_SAFE_INTEGER)
    .required();

export const optionalArray = (itemsSchema) =>
  Joi.array().items(itemsSchema).optional();

export const requiredEnum = (enumValues) =>
  Joi.string()
    .valid(...enumValues)
    .required();
export const optionalEnum = (enumValues) =>
  Joi.string()
    .valid(...enumValues)
    .allow(null, "")
    .optional();

export const requiredObject = (itemsSchema) =>
  Joi.object({ ...itemsSchema }).required();
export const optionalObject = (itemsSchema) =>
  Joi.object({ ...itemsSchema }).optional();
export const optionalObjectWithoutSchema = () => Joi.object().optional();

export const futureOrTodayDate = () =>
  Joi.string()
    .required()
    .messages({
      "any.required": "Date is required",
      "string.empty": "Date is required",
      "string.pattern.base": "Date must be in DD-MM-YYYY format",
    })
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .custom((value, helpers) => {
      const inputDate = moment(value, "DD-MM-YYYY", true);
      if (!inputDate.isValid()) {
        return helpers.message("Invalid date format. Use DD-MM-YYYY.");
      }

      const today = moment().startOf("day");

      if (inputDate.isBefore(today)) {
        return helpers.message("Date must be today or a future date.");
      }

      return value;
    }, "Date validation");

export const requiredArrayWithMinimumLength = (itemsSchema, min = 1) => {
  return Joi.array()
    .items(itemsSchema)
    .min(min)
    .required()
    .messages({
      "array.min": `{{#label}} must contain at least ${min} items`,
    });
};

export const otpSchema = (length = 6, field = "otp") => {
  return Joi.string()
    .length(length)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": `${field} must be exactly ${length} digits`,
      "string.pattern.base": `${field} must contain only numbers`,
    });
};

export const requiredOptionalString = (field = "status", value, min, max) =>
  Joi.string().min(min).max(max).allow("", null).optional().when(field, {
    is: value,
    then: Joi.required(),
    otherwise: Joi.optional(),
  });

export const passwordChangeSchema = () => {
  return {
    currentPassword: Joi.string()
      .trim()
      .required()
      .max(30)
      .disallow("")
      .messages({
        "string.empty": "Current Password is required",
        "any.required": "Current Password is required",
        "string.max": `Current Password must be at most ${30} characters`,
        "any.disallow": "Current Password is required",
      }),
    newPassword: Joi.string()
      .trim()
      .required()
      .min(8)
      .max(30)
      .pattern(PASSWORD_REGEX)
      .disallow("")
      .messages({
        "string.empty": "New Password is required",
        "any.required": "New Password is required",
        "string.min": `New Password must be at least ${8} characters`,
        "string.max": `New Password must be at most ${30} characters`,
        "string.pattern.base": STRONG_PASSWORD_ERROR.replace(
          "Password",
          "New Password",
        ),
        "any.disallow": "New Password is required",
      })
      .invalid(Joi.ref("currentPassword"))
      .messages({
        "any.invalid": "New password must be different from current password",
      }),
    confirmPassword: Joi.string()
      .trim()
      .when("newPassword", {
        is: Joi.string().min(1),
        then: Joi.valid(Joi.ref("newPassword")).required().messages({
          "any.only": "Confirm password does not match new password",
          "any.required": "Please confirm your new password",
        }),
        otherwise: Joi.optional().allow(""),
      }),
  };
};

export const requiredOptionalNumber = (field = "status", value, min, max) =>
  Joi.number().min(min).max(max).when(Joi.ref(field), {
    is: value,
    then: Joi.required(),
    otherwise: Joi.optional(),
  });

export const dateSchema = (fieldName) =>
  Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .allow("")
    .optional()
    .messages({
      "string.pattern.base": `${fieldName} must be in DD-MM-YYYY format`,
    });

export const requiredUnixTimestamp = () =>
  Joi.number().integer().min(Date.now()).required();

export const requiredOptionalStringConditionArray = (
  field = "status",
  valuesArray,
  min,
  max,
) =>
  Joi.string()
    .min(min)
    .max(max)
    .optional()
    .when(field, {
      is: Joi.valid(...valuesArray),
      then: Joi.required(),
      otherwise: Joi.optional(),
    });

export const optionalArrayWithMinimumLength = (itemsSchema, min = 1) => {
  return Joi.array()
    .items(itemsSchema)
    .min(min)
    .optional()
    .empty(Joi.array().length(0))
    .messages({
      "array.min": `{{#label}} must contain at least ${min} item${
        min > 1 ? "s" : ""
      }`,
    });
};

export const requiredTimestamp = () => Joi.number().integer().required();

export const patternValidatorOptional = (
  pattern = /^[0-9]{9,18}$/,
  errorMessage = "Invalid format",
) => {
  return Joi.string().pattern(pattern).optional().messages({
    "string.pattern.base": errorMessage,
  });
};

export const optionalTimestamp = () =>
  Joi.number().integer().optional().allow("", null);

const objectIdPattern = /^[a-f\d]{24}$/i;

export const loginWithEmailOrMobileSchema = {
  type: Joi.string().valid("email", "mobile").required().messages({
    "any.required": "Type is required",
    "any.only": "Type must be either 'email' or 'mobile'",
  }),

  email: Joi.alternatives().conditional("type", {
    is: "email",
    then: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email",
    }),
    otherwise: Joi.forbidden(),
  }),

  mobile: Joi.alternatives().conditional("type", {
    is: "mobile",
    then: Joi.string()
      .pattern(/^[0-9]{6,15}$/)
      .required()
      .messages({
        "any.required": "Mobile number is required",
        "string.pattern.base": "Mobile number must be valid",
      }),
    otherwise: Joi.forbidden(),
  }),

  country_code: Joi.alternatives().conditional("type", {
    is: "mobile",
    then: Joi.string().pattern(objectIdPattern).required().messages({
      "any.required": "Country code (Mongo ID) is required for mobile login",
      "string.pattern.base": "Country code must be a valid MongoDB ObjectId",
    }),
    otherwise: Joi.forbidden(),
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
};

export const registerWithEmailOrMobileSchema = {
  type: Joi.string().valid("email", "mobile").required().messages({
    "any.required": "Type is required",
    "any.only": "Type must be either 'email' or 'mobile'",
  }),

  email: Joi.alternatives().conditional("type", {
    is: "email",
    then: Joi.string().email().required().messages({
      "any.required": "Email is required",
      "string.email": "Email must be a valid email",
    }),
    otherwise: Joi.forbidden(),
  }),

  phone: Joi.alternatives().conditional("type", {
    is: "mobile",
    then: Joi.string()
      .pattern(/^[0-9]{6,15}$/)
      .required()
      .messages({
        "any.required": "Mobile number is required",
        "string.pattern.base": "Mobile number must be valid",
      }),
    otherwise: Joi.forbidden(),
  }),

  country_code: Joi.alternatives().conditional("type", {
    is: "mobile",
    then: Joi.string().pattern(objectIdPattern).required().messages({
      "any.required": "Country code (Mongo ID) is required for mobile login",
      "string.pattern.base": "Country code must be a valid MongoDB ObjectId",
    }),
    otherwise: Joi.forbidden(),
  }),
  fcm_token: Joi.string().optional(),
};

export const usernameValidation = () =>
  Joi.string()
    .min(3)
    .max(30)
    .pattern(/^[a-zA-Z0-9_]+$/)
    .required()
    .messages({
      "string.pattern.base":
        "Username can only contain letters, numbers, and underscores",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username cannot be longer than 30 characters",
      "string.empty": "Username is required",
    });

export const urlValidation = (fieldName = "URL") =>
  Joi.string()
    .trim()
    .uri()
    .allow("", null)
    .optional()
    .messages({
      "string.uri": `Please enter a valid ${fieldName}`,
    });

export const objectIdValidation = (field = "ObjectId") =>
  Joi.string()
    .length(24)
    .pattern(/^[a-f\d]{24}$/i)
    .required()
    .messages({
      "string.pattern.base": `Invalid ${field} format`,
      "string.length": `${field} must be 24 characters`,
      "any.required": `${field} is required`,
    });

export const optionalObjectId = (field = "ObjectId") =>
  Joi.string()
    .length(24)
    .pattern(/^[a-f\d]{24}$/i)
    .optional()
    .allow("", null)
    .messages({
      "string.pattern.base": `${field} must be a valid 24-character hex string`,
      "string.length": `${field} must be exactly 24 characters long`,
      "any.only": `${field} cannot be empty or null`,
    });

export const countryCodeSchema = () => {
  return Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Country name must be a string",
      "any.required": "Country name is required",
    }),
    dialCode: Joi.string().required().messages({
      "string.base": "Dial code must be a string",
      "any.required": "Dial code is required",
    }),
    shortName: Joi.string().required().messages({
      "string.base": "Short name must be a string",
      "any.required": "Short name is required",
    }),
    emoji: Joi.string().required().messages({
      "string.base": "Emoji must be a string",
      "any.required": "Emoji is required",
    }),
  }).required();
};

export const countryCodeOptionalSchema = () => {
  return Joi.object({
    name: Joi.string().required().messages({
      "string.base": "Country name must be a string",
      "any.required": "Country name is required",
    }),
    dialCode: Joi.string().required().messages({
      "string.base": "Dial code must be a string",
      "any.required": "Dial code is required",
    }),
    shortName: Joi.string().required().messages({
      "string.base": "Short name must be a string",
      "any.required": "Short name is required",
    }),
    emoji: Joi.string().required().messages({
      "string.base": "Emoji must be a string",
      "any.required": "Emoji is required",
    }),
  }).optional();
};

export const conditionalArray = (
  dependentField,
  matchValues = [],
  min = 1,
  itemsSchema = Joi.string(),
) => {
  return Joi.alternatives().conditional(Joi.ref(dependentField), {
    is: Joi.valid(...matchValues),
    then: Joi.array()
      .items(itemsSchema)
      .min(min)
      .required()
      .messages({
        "array.min": `{{#label}} must contain at least ${min} item${
          min > 1 ? "s" : ""
        }`,
        "any.required":
          "{{#label}} is required when " +
          dependentField +
          " is " +
          matchValues.join(", "),
      }),
    otherwise: Joi.array().items(itemsSchema).optional(),
  });
};

export const loginIdentifierValidation = () =>
  Joi.string()
    .required()
    .custom((value, helpers) => {
      if (value.includes("@")) {
        const emailSchema = Joi.string().email();
        const { error } = emailSchema.validate(value);
        if (error) {
          return helpers.message("Please enter a valid email address");
        }
      } else {
        const usernameSchema = Joi.string()
          .min(3)
          .max(30)
          .pattern(/^[a-zA-Z0-9_]+$/);
        const { error } = usernameSchema.validate(value);
        if (error) {
          return helpers.message(
            "Username must be 3–30 characters and can only contain letters, numbers, and underscores",
          );
        }
      }
      return value;
    })
    .messages({
      "string.empty": "Email or username is required",
    });

export const optionalEmailValidation = () =>
  Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .allow("", null)
    .messages({
      "string.email": "Please enter a valid email address",
    });

export const requiredOptionalArray = (
  field = "status",
  value,
  min = 1,
  max = undefined,
  itemsSchema = Joi.any(),
) =>
  Joi.array()
    .items(itemsSchema)
    .min(min)
    .max(max || Number.MAX_SAFE_INTEGER)
    .optional()
    .when(field, {
      is: value,
      then: Joi.required(),
      otherwise: Joi.optional(),
    });

export const requiredOptionalObject = (field = "status", value, keysSchema) =>
  Joi.object(keysSchema).when(Joi.ref(field), {
    is: value,
    then: Joi.required(),
    otherwise: Joi.optional(),
  });

export const optionalPasswordValidation = (min = 8, max = 30) =>
  Joi.string()
    .trim()
    .min(min)
    .max(max)
    .pattern(PASSWORD_REGEX)
    .allow("", null)
    .messages({
      "string.min": `Password must be at least ${min} characters`,
      "string.max": `Password must be at most ${max} characters`,
      "string.pattern.base": STRONG_PASSWORD_ERROR,
    });

export const optionalConfirmPasswordValidation = () =>
  Joi.string()
    .trim()
    .when("password", {
      is: Joi.string().min(1),
      then: Joi.valid(Joi.ref("password")).messages({
        "any.only": "Confirm password does not match password",
      }),
      otherwise: Joi.optional().allow("", null),
    });

export const combinedLoginSchemaNoPassword = () => {
  return {
    loginOption: Joi.string().valid("email", "phone").required().messages({
      "any.required": "loginOption field is required",
      "any.only": 'loginOption must be either "email" or "phone"',
    }),
    email: Joi.alternatives().conditional("loginOption", {
      is: "email",
      then: emailValidation(),
      otherwise: Joi.forbidden(),
    }),
    countryCode: Joi.alternatives().conditional("loginOption", {
      is: "phone",
      then: countryCodeSchema(),
      otherwise: Joi.forbidden(),
    }),
    phoneNumber: Joi.alternatives().conditional("loginOption", {
      is: "phone",
      then: requiredString(6, 15).messages({
        "any.required": "Phone number is required for phone login",
      }),
      otherwise: Joi.forbidden(),
    }),
    fcmToken: optionalString(0, Number.MAX_SAFE_INTEGER),
  };
};

export const combinedNewContactSchema = () => {
  return {
    type: Joi.string().valid("email", "phone").required().messages({
      "any.required": "type field is required",
      "any.only": 'type must be either "email" or "phone"',
    }),

    newContact: Joi.alternatives().conditional("type", {
      is: "email",
      then: emailValidation().messages({
        "any.required": "Email is required when type is 'email'",
      }),
      otherwise: requiredString(6, 15).messages({
        "any.required": "Phone number is required when type is 'phone'",
      }),
    }),

    newCountryCode: Joi.alternatives().conditional("type", {
      is: "phone",
      then: countryCodeSchema().messages({
        "any.required": "Country code is required when type is 'phone'",
      }),
      otherwise: Joi.forbidden(),
    }),

    redisToken: optionalString(30, Number.MAX_SAFE_INTEGER),
  };
};

export const arrayValidation = (schema) => Joi.array().items(schema).optional();

export const requiredOptionalUnixTimestamp = (
  fieldToCheck,
  triggerValue,
  timestampField = "time",
) => {
  return Joi.number()
    .integer()
    .when(Joi.ref(fieldToCheck), {
      is: triggerValue,
      then: Joi.number()
        .min(Date.now())
        .required()
        .messages({
          "any.required": `${timestampField} is required.`,
          "number.base": `${timestampField} must be a valid number.`,
          "number.integer": `${timestampField} must be an integer.`,
          "number.min": `${timestampField} must be greater than the current time.`,
        }),
      otherwise: Joi.optional(),
    });
};

export const fileObjectJoiSchema = () => {
  return Joi.object({
    filename: Joi.string().required(),
    path: Joi.string().required(),
    mimetype: Joi.string().required(),
    url: Joi.string().uri().required(),
  });
};

export const optionalFileObjectJoiSchema = () => {
  return Joi.object({
    filename: Joi.string().required(),
    path: Joi.string().required(),
    mimetype: Joi.string().required(),
    url: Joi.string().uri().required(),
  })
    .optional()
    .allow({});
};
