import {
  apiHTTPResponse,
  logMessage,
  verifyPassword,
} from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import { findOneByQuery } from "../../services/serviceGlobal.js";
import { User } from "../../models/index.js";
import { signToken } from "../../utils/jwtTokenUtils.js";

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
          CONSTANTS.BAD_REQUEST
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
        CONSTANTS.ERROR_FALSE
      );
    } else if (statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_NOT_FOUND,
        CONSTANTS_MSG.INVALID_EMAIL,
        CONSTANTS.DATA_NULL,
        CONSTANTS.NOT_FOUND
      );
    } else {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST
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
      CONSTANTS.INTERNAL_SERVER_ERROR
    );
  }
};
