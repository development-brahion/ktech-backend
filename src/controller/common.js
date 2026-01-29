import { apiHTTPResponse, logMessage } from "../utils/globalFunction.js";
import * as CONSTANTS from "../utils/constants.js";
import * as CONSTANTS_MSG from "../utils/constantsMessage.js";
import crudService from "../services/crudService.js";
import { findOneByQueryLean } from "../services/serviceGlobal.js";

export const nameStatusController = (
  Model,
  messages = {},
  entityName = "Record",
) => {
  return {
    list: async (req, res) => {
      try {
        return crudService.getList(Model, CONSTANTS.BOOLEAN_TRUE)(req, res);
      } catch (error) {
        logMessage(`Error in list ${entityName}`, error, "error");
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
    },

    create: async (req, res) => {
      try {
        const { name } = req.body;

        const { statusCode } = await findOneByQueryLean(Model, {
          name: { $regex: `^${name.trim()}$`, $options: "i" },
          isDeleted: CONSTANTS.BOOLEAN_FALSE,
        });

        if (statusCode === CONSTANTS.OK) {
          return apiHTTPResponse(
            req,
            res,
            CONSTANTS.HTTP_CONFLICT,
            messages.exists || `${entityName} already exists`,
            CONSTANTS.DATA_NULL,
            CONSTANTS.CONFLICT,
          );
        }

        return crudService.create(
          Model,
          messages.create || `${entityName} created successfully`,
          CONSTANTS.BOOLEAN_TRUE,
        )(req, res);
      } catch (error) {
        logMessage(`Error in create ${entityName}`, error, "error");
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
    },

    update: async (req, res) => {
      try {
        const { name, _id } = req.body;

        const { statusCode } = await findOneByQueryLean(Model, {
          _id: { $ne: _id },
          name: { $regex: `^${name.trim()}$`, $options: "i" },
          isDeleted: CONSTANTS.BOOLEAN_FALSE,
        });

        if (statusCode === CONSTANTS.OK) {
          return apiHTTPResponse(
            req,
            res,
            CONSTANTS.HTTP_CONFLICT,
            messages.exists || `${entityName} already exists`,
            CONSTANTS.DATA_NULL,
            CONSTANTS.CONFLICT,
          );
        }

        return crudService.update(
          Model,
          messages.update || `${entityName} updated successfully`,
          CONSTANTS.BOOLEAN_TRUE,
        )(req, res);
      } catch (error) {
        logMessage(`Error in update ${entityName}`, error, "error");
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
    },

    enableDisable: async (req, res) => {
      try {
        return crudService.enableDisable(
          Model,
          messages.status || `${entityName} status updated successfully`,
          CONSTANTS.BOOLEAN_TRUE,
          entityName,
          CONSTANTS.BLANK_OBJECT,
          CONSTANTS.BLANK_OBJECT,
          "status",
        )(req, res);
      } catch (error) {
        logMessage(`Error in enable/disable ${entityName}`, error, "error");
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
    },

    softDelete: async (req, res) => {
      try {
        return crudService.softDelete(
          Model,
          messages.delete || `${entityName} deleted successfully`,
          CONSTANTS.BOOLEAN_TRUE,
        )(req, res);
      } catch (error) {
        logMessage(`Error in delete ${entityName}`, error, "error");
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
    },

    allDocs: async (req, res) => {
      try {
        return crudService.getALLDocuments(Model, CONSTANTS.BOOLEAN_FALSE)(
          req,
          res,
        );
      } catch (error) {
        logMessage(`Error in get all ${entityName}`, error, "error");
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
    },
  };
};
