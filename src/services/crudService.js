import { apiHTTPResponse } from "../utils/globalFunction.js";
import * as CONSTANTS from "../utils/constants.js";
import * as CONSTANTS_MSG from "../utils/constantsMessage.js";
import {
  createDocument,
  updateDocument,
  softDeleteDocument,
  updateMultipleDocumentByQueryAndData,
  updateDocumentByQueryAndData,
  buildPopulateFields,
  getListDocuments,
  getAllDocuments,
  executeAggregation,
  findOneByQuery,
  deleteDocument,
  findOneByQueryLeanWithPopulateAndSelect,
} from "./serviceGlobal.js";

const handleSuccess = (req, res, message, data = CONSTANTS.DATA_NULL) =>
  apiHTTPResponse(
    req,
    res,
    CONSTANTS.HTTP_OK,
    message,
    data,
    CONSTANTS.OK,
    CONSTANTS.ERROR_FALSE,
  );

const handleFailure = (
  req,
  res,
  code = CONSTANTS.HTTP_BAD_REQUEST,
  message = CONSTANTS_MSG.FAILED_MSG,
  errorCode = CONSTANTS.BAD_REQUEST,
) =>
  apiHTTPResponse(
    req,
    res,
    code,
    message,
    CONSTANTS.DATA_NULL,
    errorCode,
    CONSTANTS.ERROR_TRUE,
  );

const handleError = (req, res, error, tag, service = "GlobalCrudService") => {
  console.error(
    `[${service}] Controller Error (${tag}):`,
    error?.message || error,
    error?.stack,
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
};

const globalCrudService = {
  create:
    (
      model,
      message = "SUCCESS_MSG",
      rawMessage = CONSTANTS.BOOLEAN_FALSE,
      isReturnId = false,
    ) =>
    async (req, res) => {
      try {
        const result = await createDocument(model, req.body);
        return result.statusCode === CONSTANTS.OK
          ? handleSuccess(
              req,
              res,
              rawMessage ? message : CONSTANTS_MSG[message],
              isReturnId ? { _id: result.data._id } : CONSTANTS.DATA_NULL,
            )
          : handleFailure(req, res);
      } catch (error) {
        return handleError(req, res, error, `${model} - create`);
      }
    },

  update:
    (
      model,
      message = "SUCCESS_MSG",
      rawMessage = CONSTANTS.BOOLEAN_FALSE,
      isReturnId = false,
      isFromCrud = true
    ) =>
    async (req, res) => {
      try {
        const { _id, ...rest } = req.body;
        const result = await updateDocument(
          model,
          _id,
          { ...rest, updatedAt: Date.now() },
          isFromCrud,
        );
        if (result.statusCode === CONSTANTS.OK)
          return handleSuccess(
            req,
            res,
            rawMessage ? message : CONSTANTS_MSG[message],
            isReturnId ? { _id: result.data._id } : CONSTANTS.DATA_NULL,
          );
        if (result.statusCode === CONSTANTS.NOT_FOUND)
          return handleFailure(
            req,
            res,
            CONSTANTS.HTTP_NOT_FOUND,
            CONSTANTS_MSG.DATA_NOT_FOUND,
          );
        return handleFailure(req, res);
      } catch (error) {
        return handleError(req, res, error, `${model} - update`);
      }
    },

  softDelete:
    (
      model,
      message = "SUCCESS_MSG",
      rawMessage = CONSTANTS.BOOLEAN_FALSE,
      extraQuery = {},
      extraBody = {},
    ) =>
    async (req, res) => {
      try {
        const result = await softDeleteDocument(
          model,
          {
            _id: req.body._id,
            isDeleted: CONSTANTS.BOOLEAN_FALSE,
            ...extraQuery,
          },
          {
            isDeleted: CONSTANTS.BOOLEAN_TRUE,
            updatedAt: Date.now(),
            ...extraBody,
          },
        );

        if (result.statusCode === CONSTANTS.OK)
          return handleSuccess(
            req,
            res,
            rawMessage ? message : CONSTANTS_MSG[message],
          );
        if (result.statusCode === CONSTANTS.NOT_FOUND)
          return handleFailure(
            req,
            res,
            CONSTANTS.HTTP_NOT_FOUND,
            CONSTANTS_MSG.DATA_NOT_FOUND,
          );
        return handleFailure(req, res);
      } catch (error) {
        return handleError(req, res, error, `${model} - softDelete`);
      }
    },

  softDeleteMultiple:
    (
      model,
      message = "SUCCESS_MSG",
      rawMessage = CONSTANTS.BOOLEAN_FALSE,
      extraQuery = {},
      extraBody = {},
    ) =>
    async (req, res) => {
      try {
        const result = await updateMultipleDocumentByQueryAndData(
          model,
          {
            _id: { $in: req.body._id },
            isDeleted: CONSTANTS.BOOLEAN_FALSE,
            ...extraQuery,
          },
          {
            isDeleted: CONSTANTS.BOOLEAN_TRUE,
            updatedAt: Date.now(),
            ...extraBody,
          },
        );

        if (result.statusCode === CONSTANTS.OK)
          return handleSuccess(
            req,
            res,
            rawMessage ? message : CONSTANTS_MSG[message],
          );
        if (result.statusCode === CONSTANTS.NOT_FOUND)
          return handleFailure(
            req,
            res,
            CONSTANTS.HTTP_NOT_FOUND,
            CONSTANTS_MSG.DATA_NOT_FOUND,
          );
        return handleFailure(req, res);
      } catch (error) {
        return handleError(req, res, error, `${model} - softDeleteMultiple`);
      }
    },

  enableDisable:
    (
      model,
      message = "SUCCESS_MSG",
      rawMessage = CONSTANTS.BOOLEAN_FALSE,
      entity = "Entity",
      extraQuery = {},
      extraBody = {},
      accessKey = "isDisable",
    ) =>
    async (req, res) => {
      try {
        const { _id } = req.body;

        const value = req.body[accessKey];

        const { statusCode, data } = await findOneByQuery(model, {
          _id,
          isDeleted: CONSTANTS.BOOLEAN_FALSE,
          ...extraQuery,
        });

        if (statusCode !== CONSTANTS.OK || !data) {
          return handleFailure(
            req,
            res,
            CONSTANTS.HTTP_NOT_FOUND,
            CONSTANTS_MSG.DATA_NOT_FOUND,
          );
        }

        if (data[accessKey] === value) {
          return handleFailure(
            req,
            res,
            CONSTANTS.HTTP_CONFLICT,
            `${entity} is already in the same state.`,
            CONSTANTS.CONFLICT,
          );
        }

        const result = await updateDocumentByQueryAndData(
          model,
          { _id, isDeleted: CONSTANTS.BOOLEAN_FALSE },
          {
            [accessKey]: value,
            updatedAt: Date.now(),
            ...extraBody,
          },
        );

        if (result.statusCode === CONSTANTS.OK) {
          return handleSuccess(
            req,
            res,
            rawMessage ? message : CONSTANTS_MSG[message],
          );
        }

        return handleFailure(
          req,
          res,
          CONSTANTS.HTTP_BAD_REQUEST,
          CONSTANTS_MSG.SOMETHING_WENT_WRONG,
        );
      } catch (error) {
        return handleError(req, res, error, `${model} - enableDisable`);
      }
    },

  enableDisableMultiple:
    (
      model,
      message = "SUCCESS_MSG",
      rawMessage = CONSTANTS.BOOLEAN_FALSE,
      extraQuery = {},
      extraBody = {},
      accessKey = "isDisable",
    ) =>
    async (req, res) => {
      try {
        const { _id } = req.body;
        const value = req.body[accessKey];

        const result = await updateMultipleDocumentByQueryAndData(
          model,
          {
            _id: { $in: _id },
            isDeleted: CONSTANTS.BOOLEAN_FALSE,
            ...extraQuery,
          },
          {
            [accessKey]: value,
            updatedAt: Date.now(),
            ...extraBody,
          },
        );

        if (result.statusCode === CONSTANTS.OK)
          return handleSuccess(
            req,
            res,
            rawMessage ? message : CONSTANTS_MSG[message],
          );

        if (result.statusCode === CONSTANTS.NOT_FOUND)
          return handleFailure(
            req,
            res,
            CONSTANTS.HTTP_NOT_FOUND,
            CONSTANTS_MSG.DATA_NOT_FOUND,
          );

        return handleFailure(req, res);
      } catch (error) {
        return handleError(req, res, error, `${model} - enableDisableMultiple`);
      }
    },

  getList: (model, isDeletedApplicable) => async (req, res) => {
    try {
      const options = {
        pageNo: parseInt(req.body.page) || 1,
        size: parseInt(req.body.size) || 10,
        sortBy: req.body.sortBy || "createdAt",
        sortOrder: req.body.sortOrder || "desc",
        keyWord: req.body.keyWord || "",
        searchFields: req.body.searchFields || "",
        query:
          req.body.query && typeof req.body.query === "string"
            ? JSON.parse(req.body.query)
            : req.body.query || {},
        select: req.body.select || "",
        fromDate: req.body.fromDate || "",
        toDate: req.body.toDate || "",
        populate: buildPopulateFields(req.body.populate),
      };


      const result = await getListDocuments(
        model,
        options,
        isDeletedApplicable,
      );
      return result.statusCode === CONSTANTS.OK
        ? handleSuccess(req, res, CONSTANTS_MSG.SUCCESS_MSG, result.data)
        : handleFailure(req, res);
    } catch (error) {
      return handleError(req, res, error, `${model} - getList`);
    }
  },

  getALLDocuments:
    (model, builtIn = true) =>
    async (req, res) => {
      try {
        const options = {
          sortBy: req.body.sortBy || "createdAt",
          sortOrder: req.body.sortOrder || "desc",
          keyWord: req.body.keyWord || "",
          searchFields: req.body.searchFields || "",
          query:
            req.body.query && typeof req.body.query === "string"
              ? JSON.parse(req.body.query)
              : req.body.query || {},
          select: req.body.select || "",
          fromDate: req.body.fromDate || "",
          toDate: req.body.toDate || "",
          populate: buildPopulateFields(req.body.populate),
        };

        const result = await getAllDocuments(model, options, builtIn);
        return result.statusCode === CONSTANTS.OK
          ? handleSuccess(req, res, CONSTANTS_MSG.SUCCESS_MSG, result.data)
          : handleFailure(req, res);
      } catch (error) {
        return handleError(req, res, error, `${model} - getALLDocuments`);
      }
    },

  executeAggregation:
    (model, pipeline, isSingle = CONSTANTS.BOOLEAN_FALSE) =>
    async (req, res) => {
      try {
        const result = await executeAggregation(model, pipeline);

        return result.statusCode === CONSTANTS.OK
          ? handleSuccess(
              req,
              res,
              CONSTANTS_MSG.SUCCESS_MSG,
              isSingle ? result.data[0] || {} : result.data,
            )
          : handleFailure(req, res);
      } catch (error) {
        return handleError(req, res, error, `${model} - executeAggregation`);
      }
    },

  changePassword:
    (model, message = "SUCCESS_MSG", rawMessage = CONSTANTS.BOOLEAN_FALSE) =>
    async (req, res) => {
      try {
        const { _id, password, data = null } = req.body;
        const result = await findOneByQuery(model, { _id });

        if (result.statusCode === CONSTANTS.OK) {
          result.data.password = password;
          result.data.updatedAt = Date.now();

          if (data) {
            Object.assign(result.data, { ...data });
          }
          await result.data.save();
          return handleSuccess(
            req,
            res,
            rawMessage ? message : CONSTANTS_MSG[message],
          );
        }

        return handleFailure(
          req,
          res,
          CONSTANTS.HTTP_NOT_FOUND,
          CONSTANTS_MSG.DATA_NOT_FOUND,
        );
      } catch (error) {
        return handleError(req, res, error, `${model} - changePassword`);
      }
    },

  getById:
    (model, message = "SUCCESS_MSG", rawMessage = CONSTANTS.BOOLEAN_FALSE) =>
    async (req, res) => {
      try {
        const { _id, select = "", populate = "", data = {} } = req.body;
        const result = await findOneByQueryLeanWithPopulateAndSelect(
          model,
          { _id, isDeleted: CONSTANTS.BOOLEAN_FALSE, ...data },
          select,
          buildPopulateFields(populate),
        );

        return result.statusCode === CONSTANTS.OK
          ? handleSuccess(
              req,
              res,
              rawMessage ? message : CONSTANTS_MSG[message],
              result.data,
            )
          : handleFailure(
              req,
              res,
              CONSTANTS.HTTP_NOT_FOUND,
              CONSTANTS_MSG.DATA_NOT_FOUND,
            );
      } catch (error) {
        return handleError(req, res, error, `${model} - getById`);
      }
    },

  hardDelete:
    (model, message = "SUCCESS_MSG", rawMessage = CONSTANTS.BOOLEAN_FALSE) =>
    async (req, res) => {
      try {
        const result = await deleteDocument(model, req.body._id);

        if (result.statusCode === CONSTANTS.OK) {
          return handleSuccess(
            req,
            res,
            rawMessage ? message : CONSTANTS_MSG[message],
            result.data,
          );
        } else {
          return handleFailure(req, res);
        }
      } catch (error) {
        return handleError(req, res, error, `${model} - hardDelete`);
      }
    },
};

export default globalCrudService;
