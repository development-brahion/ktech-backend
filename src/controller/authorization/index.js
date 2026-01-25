import {
  apiHTTPResponse,
  hashAndEncryptPassword,
  isProduction,
  logMessage,
  verifyPassword,
} from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { findOneByQuery } from "../../services/serviceGlobal.js";
import { User } from "../../models/index.js";
import { signToken } from "../../utils/jwtTokenUtils.js";
import { resetPasswordLinkProcessTemplate } from "../../utils/mailer.js";
import jwt from "jsonwebtoken";

export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { statusCode, data } = await findOneByQuery(User, {
      email: email.trim().toLowerCase(),
      status: true,
    });

    if (statusCode === CONSTANTS.OK && data) {
      const isPasswordMatch = await verifyPassword(data.password, password);

      if (!isPasswordMatch) {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_BAD_REQUEST,
          CONSTANTS_MSG.INVALID_PASSWORD,
          CONSTANTS.DATA_NULL,
          CONSTANTS.BAD_REQUEST,
        );
      }

      const payloadData = {
        name: data.name,
        email: data.email,
        role: data.role,
        id: data._id,
      };

      const token = signToken(payloadData);

      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        CONSTANTS_MSG.LOGIN_SUCCESS,
        {
          token: token,
          ...payloadData,
        },
        CONSTANTS.OK,
        CONSTANTS.ERROR_FALSE,
      );
    } else if (statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        CONSTANTS_MSG.INVALID_EMAIL,
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    } else {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in signIn controller", error, "error");
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

export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email;

    const { statusCode, data } = await findOneByQuery(User, {
      email: email.trim().toLowerCase(),
      status: true,
    });

    if (statusCode === CONSTANTS.OK && data) {
      const payloadData = {
        userId: data._id,
        email: data.email,
      };

      const token = signToken(payloadData, "15m");

      const resetLink = `${process.env.NEXT_AUTH_URL}/updatePassword?token=${token}`;

      if (isProduction()) {
        const { success } = await resetPasswordLinkProcessTemplate(email, {
          resetLink,
          expiryTime: "15 minutes",
        });

        if (success) {
          return apiHTTPResponse(
            req,
            res,
            CONSTANTS.HTTP_OK,
            "A password reset link has been sent to your email. Please check your inbox or spam folder.",
            CONSTANTS.DATA_NULL,
            CONSTANTS.OK,
          );
        } else {
          return apiHTTPResponse(
            req,
            res,
            CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
            CONSTANTS_MSG.SERVER_ERROR,
            CONSTANTS.DATA_NULL,
            CONSTANTS.INTERNAL_SERVER_ERROR,
          );
        }
      } else {
        return apiHTTPResponse(
          req,
          res,
          CONSTANTS.HTTP_OK,
          "A password reset link has been sent to your email. Please check your inbox or spam folder.",
          { resetLink },
          CONSTANTS.OK,
        );
      }
    } else if (statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        CONSTANTS_MSG.INVALID_EMAIL,
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND,
      );
    } else {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in forgotPassword controller", error, "error");
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

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_UNAUTHORIZED,
        "Invalid or expired token",
        CONSTANTS.DATA_NULL,
        CONSTANTS.UNAUTHORIZED,
      );
    }

    const user = await User.findOne({
      _id: decoded.userId,
      email: decoded.email,
      status: true,
    });

    if (!user) {
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

    user.password = hashedPassword;
    user.originalPassword = encryptedPassword;

    await user.save();

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Password updated successfully",
      CONSTANTS.DATA_NULL,
      CONSTANTS.OK,
    );
  } catch (error) {
    logMessage("Error in resetPassword controller", error, "error");
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
