import * as CONSTANTS from "./constants.js";
import bcrypt from "bcrypt";
import geoip from "geoip-lite";
import moment from "moment-timezone";
import * as crypto from "crypto";

export const guessedTimezone = "Asia/Kolkata";

export const momentTZ = moment;

export const resultDb = (statusCode, data = null) => {
  return {
    statusCode: statusCode,
    data: data,
  };
};

export function generateKey(length = CONSTANTS.VERIFICATION_TOKEN_LENGTH) {
  var key = "";
  var possible =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0; i < length; i++) {
    key += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return key;
}

export const isProduction = () => {
  return process.env.IS_PRODUCTION === "true";
};

export function generateOTP(length = CONSTANTS.OTP_LENGTH) {
  var key = "";
  var possible = "0123456789";
  for (var i = 0; i < length; i++) {
    key += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return key;
}

export async function verifyPassword(hash, password) {
  try {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
  } catch (err) {
    logMessage("Error verifying password", err, "error");
    return false;
  }
}

export const apiHTTPResponse = (
  req,
  res,
  httpCode = CONSTANTS.HTTP_SERVICE_UNAVAILABLE,
  message = CONSTANTS.DATA_NULL,
  data = CONSTANTS.DATA_NULL,
  code = CONSTANTS.SERVICE_UNAVAILABLE,
  error = CONSTANTS.ERROR_TRUE,
) => {
  return res.status(httpCode).json({
    message: message || "error",
    code: code,
    error: httpCode === CONSTANTS.HTTP_OK ? CONSTANTS.ERROR_FALSE : error,
    data: data,
  });
};

export const joiValidatorFunction = async (schema, data) => {
  try {
    await schema.validateAsync(data, {
      abortEarly: false,
      allowUnknown: false,
    });
    return null;
  } catch (error) {
    const errorMap = error?.details?.reduce((acc, detail) => {
      const fieldName = detail.context.label || detail.path[0];
      const errorMessage = detail.message.replace(/"/g, "");
      acc[fieldName] = errorMessage;
      return acc;
    }, {});
    return Object.values(errorMap).join(", ");
  }
};

export const ipDetectorDetails = (ip) => {
  return geoip.lookup(ip);
};

export function addTimeStamp(statusFields = true) {
  const base = {
    ...(statusFields && {
      isDisable: {
        type: Boolean,
        default: false,
      },
      isDeleted: {
        type: Boolean,
        default: false,
      },
    }),
    updatedAt: {
      type: Number,
      default: () => moment().valueOf(),
    },
    date: {
      type: Number,
      default: () => moment().startOf("day").valueOf(),
    },
    month: {
      type: Number,
      default: () => moment().startOf("month").valueOf(),
    },
    year: {
      type: Number,
      default: () => moment().startOf("year").valueOf(),
    },
    createdAt: {
      type: Number,
      default: () => moment().valueOf(),
    },
  };

  return base;
}

export const momentValueFunc = (value, format = "DD-MM-YYYY") => {
  return moment(value, format).tz(guessedTimezone).startOf("day").valueOf();
};

export function getAlreadyExistsMessage(
  entity,
  message,
  isSpecialType = false,
) {
  if (isSpecialType) {
    const formattedEntity = entity
      .replace(/-/g, " ")
      .replace(/^./, (char) => char.toUpperCase());

    return `${formattedEntity} already exists.`;
  }

  const formattedEntity = entity
    .replace(/-/g, " ")
    .replace(/^./, (char) => char.toUpperCase());

  return message.replace("{{entity}}", formattedEntity);
}

export const momentValue = (value, format = "DD-MM-YYYY") => {
  return moment(value, format).tz(guessedTimezone).valueOf();
};

export function generateOrderId(prefix = "Po", number = 5) {
  const randomNumber = Math.floor(Math.random() * Math.pow(10, number));
  const paddedNumber = randomNumber.toString().padStart(number, "0");
  return `${prefix}${paddedNumber}`;
}

export function maskEmail(email) {
  const [name, domain] = email.split("@");

  if (!name || !domain) return email;

  const firstChar = name.charAt(0);
  const lastChar = name.length > 1 ? name.charAt(name.length - 1) : "";
  const maskedPart = "*".repeat(Math.max(name.length - 2, 1));

  return `${firstChar}${maskedPart}${lastChar}@${domain}`;
}

export const autoUpdateUpdatedAt = function (next) {
  this.set({ updatedAt: Date.now() });
  next();
};

export const cleanQueryString = (str) => str.replace(/\s+/g, " ").trim();

export const uniqueById = (arr1, arr2, mergeKey = null) => {
  const combined = [...arr1, ...arr2];
  const map = new Map();

  combined.forEach((item) => {
    const key = item._id.toString();
    if (map.has(key)) {
      const existing = map.get(key);
      map.set(key, {
        ...existing,
        ...item,
        ...(mergeKey && {
          [mergeKey]: existing[mergeKey] || item[mergeKey],
        }),
      });
    } else {
      map.set(key, item);
    }
  });

  return Array.from(map.values());
};

export function maskMobileNumber(mobileNumber) {
  const numStr = String(mobileNumber);
  if (numStr.length <= 4) return numStr;
  const firstPart = numStr.substring(0, 4);
  const lastPart = numStr.substring(numStr.length - 2);
  const maskedPart = "*".repeat(numStr.length - 4);

  return `${firstPart}${maskedPart}${lastPart}`;
}

export function generateUniqueId(prefix = "ID") {
  const timestamp = Date.now().toString(36);

  const randomPart = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${prefix}${timestamp}${randomPart}`;
}

export const formatDateByMomentTimeZone = (
  timestamp,
  format = "D MMM YYYY",
) => {
  return moment.tz(timestamp, guessedTimezone).format(format);
};

export async function importJson(filePath) {
  const fileUrl = new URL(filePath, import.meta.url);
  const { default: jsonData } = await import(fileUrl, {
    assert: { type: "json" },
  });
  return jsonData;
}

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export function logMessage(
  message = "Default log message",
  error = null,
  level = "info",
) {
  const upperMessage = message.toUpperCase();

  switch (level.toLowerCase()) {
    case "error":
      if (error) {
        console.error(upperMessage, error);
      } else {
        console.error(upperMessage);
      }
      break;

    case "warn":
      console.warn(upperMessage);
      if (error) console.warn(error);
      break;

    case "info":
      console.info(upperMessage);
      if (error) console.info(error);
      break;

    case "debug":
      console.debug(upperMessage);
      if (error) console.debug(error);
      break;

    default:
      console.log(upperMessage);
      if (error) console.log(error);
      break;
  }
}

export function convertToSeconds(value, unit) {
  switch (unit) {
    case "seconds":
      return value;
    case "minutes":
      return value * 60;
    case "hours":
      return value * 3600;
    case "days":
      return value * 86400;
    default:
      throw new Error("Invalid JWT_EXP_UNIT");
  }
}

export function getAccessTokenExpiry() {
  const value = Number(process.env.JWT_EXP_VALUE);
  const unit = process.env.JWT_EXP_UNIT;

  if (!value || !unit) return 60 * 60 * 24;

  return convertToSeconds(value, unit);
}

export function getRefreshTokenExpiry() {
  const accessSec = getAccessTokenExpiry();
  const multiplier = Number(process.env.JWT_REFRESH_MULTIPLIER || 1.5);
  return Math.floor(accessSec * multiplier);
}

export const generateReferralCode = () => {
  return crypto.randomBytes(6).toString("hex");
};

export async function hashAndEncryptPassword(password) {
  if (!password) {
    throw new Error("Password is required");
  }

  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY is missing");
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "hex");

  if (ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be 32 bytes (64 hex characters)");
  }

  const IV = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, IV);

  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    hashedPassword,
    encryptedPassword: `${IV.toString("hex")}:${encrypted}`,
  };
}

export const parseDateUTC = (dateStr) => {
  const [day, month, year] = dateStr.split("-").map(Number);

  return {
    start: new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)),
    end: new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)),
  };
};
