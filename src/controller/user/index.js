import {
  apiHTTPResponse,
  generateReferralCode,
  hashAndEncryptPassword,
  logMessage,
} from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import crudService from "../../services/crudService.js";
import { User } from "../../models/index.js";
import { findOneByQueryLean, updateDocumentByQueryAndData } from "../../services/serviceGlobal.js";
import { nameStatusController } from "../common.js";

export const getUserList = async (req, res) => {
  try {
    Object.assign(req.body, {
      select:
        "name status email phoneNo address role department designation dateOfBirth dateOfJoining amount referralCode salary createdAt",
      populate: "department:name|designation:name",
      searchFields: "name email phoneNo",
      sortBy: req.body.sortBy || "createdAt",
      sortOrder: req.body.sortOrder || "desc",
    });

    return crudService.getList(User, CONSTANTS.BOOLEAN_TRUE)(req, res);
  } catch (error) {
    logMessage("Error in grt user list", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const createUser = async (req, res) => {
  try {
    const { email, password, ...rest } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    const { statusCode } = await findOneByQueryLean(
      User,
      { email: normalizedEmail },
      { statusCode: 1 },
    );

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_CONFLICT,
        "Email already exist.",
        CONSTANTS.DATA_NULL,
        CONSTANTS.CONFLICT,
      );
    }

    const { hashedPassword, encryptedPassword } =
      await hashAndEncryptPassword(password);

    const referralCode = generateReferralCode();

    const newUser = new User({
      ...rest,
      email,
      password: hashedPassword,
      originalPassword: encryptedPassword,
      referralCode,
    });

    await newUser.save();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      CONSTANTS_MSG.SUCCESS_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in create user", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { _id, password } = req.body;

    const userData = await User.findOne({
      _id,
    });

    if (!userData) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        "User not found",
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    }

    const { hashedPassword, encryptedPassword } =
      await hashAndEncryptPassword(password);

    userData.password = hashedPassword;
    userData.originalPassword = encryptedPassword;

    await userData.save();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Password updated successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in user update password", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const updateUser = async (req, res) => {
  try {
    const { _id, email, ...rest } = req.body;

    const normalizedEmail = email?.trim().toLowerCase();

    if (normalizedEmail) {
      const { statusCode } = await findOneByQueryLean(
        User,
        {
          email: normalizedEmail,
          _id: { $ne: _id },
        },
        { _id: 1 },
      );

      if (statusCode === CONSTANTS.OK) {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_CONFLICT,
          "Email already exist.",
          CONSTANTS.DATA_NULL,
          CONSTANTS.CONFLICT,
        );
      }
    }

    const updatePayload = {
      ...rest,
    };

    if (normalizedEmail) {
      updatePayload.email = normalizedEmail;
    }

    const { statusCode: newStatusCode } = await updateDocumentByQueryAndData(
      User,
      { _id },
      updatePayload,
    );

    if (newStatusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        CONSTANTS_MSG.SUCCESS_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    } else {
      return apiHTTPResponse(
        req,
        res,
        newStatusCode === CONSTANTS.NOT_FOUND
          ? CONSTANTS.HTTP_NOT_FOUND
          : CONSTANTS.HTTP_BAD_REQUEST,
        newStatusCode === CONSTANTS.NOT_FOUND
          ? CONSTANTS_MSG.DATA_NOT_FOUND
          : CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        newStatusCode === CONSTANTS.NOT_FOUND
          ? CONSTANTS.NOT_FOUND
          : CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in update user", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};

export const { enableDisable: enableDisableUser } = nameStatusController(
  User,
  {},
  "User",
);
