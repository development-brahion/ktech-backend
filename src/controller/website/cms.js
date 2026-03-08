import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import {
  AboutUs,
  TermsAndConditions,
  PrivacyPolicy,
  RefundPolicy,
  WhyUs,
  Query,
} from "../../models/index.js";
import {
  findOneByQueryLeanWithSelect,
  updateAndCreateDocumentByQueryAndData,
} from "../../services/serviceGlobal.js";
import crudService from "../../services/crudService.js";

export const updateAboutUsPanel = async (req, res) => {
  try {
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "No data provided to update about us panel",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE,
      );
    }

    const { statusCode } = await updateAndCreateDocumentByQueryAndData(
      AboutUs,
      {},
      inputData,
    );

    if (statusCode === CONSTANTS.OK) {
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
        CONSTANTS.HTTP_BAD_REQUEST,
        CONSTANTS_MSG.FAILED_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }
  } catch (error) {
    logMessage("Error in updateAboutUsPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getAboutUsPanel = async (req, res) => {
  try {
    const { statusCode, data } = await findOneByQueryLeanWithSelect(
      AboutUs,
      {},
      "-_id -__v -updatedAt -createdAt",
    );

    if (statusCode === CONSTANTS.OK || statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS[statusCode === CONSTANTS.OK ? "HTTP_OK" : "HTTP_NOT_FOUND"],
        CONSTANTS_MSG[
          [statusCode === CONSTANTS.OK ? "SUCCESS_MSG" : "DATA_NOT_FOUND"]
        ],
        data,
        statusCode,
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
    logMessage("Error in getAboutUsPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const updateTermsAndConditionsPanel = async (req, res) => {
  try {
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "No data provided to update terms and conditions",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE,
      );
    }

    const { statusCode } = await updateAndCreateDocumentByQueryAndData(
      TermsAndConditions,
      {},
      inputData,
    );

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        CONSTANTS_MSG.SUCCESS_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  } catch (error) {
    logMessage(
      "Error in updateTermsAndConditionsPanel controller",
      error,
      "error",
    );
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getTermsAndConditionsPanel = async (req, res) => {
  try {
    const { statusCode, data } = await findOneByQueryLeanWithSelect(
      TermsAndConditions,
      {},
      "-_id -__v -updatedAt -createdAt",
    );

    if (statusCode === CONSTANTS.OK || statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS[statusCode === CONSTANTS.OK ? "HTTP_OK" : "HTTP_NOT_FOUND"],
        CONSTANTS_MSG[
          statusCode === CONSTANTS.OK ? "SUCCESS_MSG" : "DATA_NOT_FOUND"
        ],
        data,
        statusCode,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  } catch (error) {
    logMessage(
      "Error in getTermsAndConditionsPanel controller",
      error,
      "error",
    );
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const updatePrivacyPolicyPanel = async (req, res) => {
  try {
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "No data provided to update privacy policy",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE,
      );
    }

    const { statusCode } = await updateAndCreateDocumentByQueryAndData(
      PrivacyPolicy,
      {},
      inputData,
    );

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        CONSTANTS_MSG.SUCCESS_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  } catch (error) {
    logMessage("Error in updatePrivacyPolicyPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getPrivacyPolicyPanel = async (req, res) => {
  try {
    const { statusCode, data } = await findOneByQueryLeanWithSelect(
      PrivacyPolicy,
      {},
      "-_id -__v -updatedAt -createdAt",
    );

    if (statusCode === CONSTANTS.OK || statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS[statusCode === CONSTANTS.OK ? "HTTP_OK" : "HTTP_NOT_FOUND"],
        CONSTANTS_MSG[
          statusCode === CONSTANTS.OK ? "SUCCESS_MSG" : "DATA_NOT_FOUND"
        ],
        data,
        statusCode,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  } catch (error) {
    logMessage("Error in getPrivacyPolicyPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const updateWhyUsPanel = async (req, res) => {
  try {
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "No data provided to update why us",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE,
      );
    }

    const { statusCode } = await updateAndCreateDocumentByQueryAndData(
      WhyUs,
      {},
      inputData,
    );

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        CONSTANTS_MSG.SUCCESS_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  } catch (error) {
    logMessage("Error in updateWhyUsPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getWhyUsPanel = async (req, res) => {
  try {
    const { statusCode, data } = await findOneByQueryLeanWithSelect(
      WhyUs,
      {},
      "-_id -__v -updatedAt -createdAt",
    );

    if (statusCode === CONSTANTS.OK || statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS[statusCode === CONSTANTS.OK ? "HTTP_OK" : "HTTP_NOT_FOUND"],
        CONSTANTS_MSG[
          statusCode === CONSTANTS.OK ? "SUCCESS_MSG" : "DATA_NOT_FOUND"
        ],
        data,
        statusCode,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  } catch (error) {
    logMessage("Error in getWhyUsPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const updateRefundPolicyPanel = async (req, res) => {
  try {
    const inputData = req.body;

    if (!inputData || Object.keys(inputData).length === 0) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "No data provided to update refund policy",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
        CONSTANTS.ERROR_TRUE,
      );
    }

    const { statusCode } = await updateAndCreateDocumentByQueryAndData(
      RefundPolicy,
      {},
      inputData,
    );

    if (statusCode === CONSTANTS.OK) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_OK,
        CONSTANTS_MSG.SUCCESS_MSG,
        CONSTANTS.DATA_NULL,
        CONSTANTS.OK,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  } catch (error) {
    logMessage("Error in updateRefundPolicyPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getRefundPolicyPanel = async (req, res) => {
  try {
    const { statusCode, data } = await findOneByQueryLeanWithSelect(
      RefundPolicy,
      {},
      "-_id -__v -updatedAt -createdAt",
    );

    if (statusCode === CONSTANTS.OK || statusCode === CONSTANTS.NOT_FOUND) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS[statusCode === CONSTANTS.OK ? "HTTP_OK" : "HTTP_NOT_FOUND"],
        CONSTANTS_MSG[
          statusCode === CONSTANTS.OK ? "SUCCESS_MSG" : "DATA_NOT_FOUND"
        ],
        data,
        statusCode,
      );
    }

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_BAD_REQUEST,
      CONSTANTS_MSG.FAILED_MSG,
      CONSTANTS.DATA_NULL,
      CONSTANTS.BAD_REQUEST,
    );
  } catch (error) {
    logMessage("Error in getRefundPolicyPanel controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const getQueryList = async (req, res) => {
  try {
    return crudService.getList(Query, CONSTANTS.BOOLEAN_FALSE)(req, res);
  } catch (error) {
    logMessage("Error in getQueryList controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};

export const submitQuery = async (req, res) => {
  try {
    return crudService.create(
      Query,
      "Your query is submitted,we will contact you soon.",
      CONSTANTS.BOOLEAN_TRUE,
    )(req, res);
  } catch (error) {
    logMessage("Error in submitQuery controller", error, "error");
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR,
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
      CONSTANTS.ERROR_TRUE,
    );
  }
};
