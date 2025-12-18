import {
  INTERNAL_SERVER_ERROR,
  DATA_NULL,
  OK,
  NOT_FOUND,
  BOOLEAN_FALSE,
  BAD_REQUEST,
} from "../utils/constants.js";
import {
  resultDb,
  momentValueFunc,
  logMessage,
} from "../utils/globalFunction.js";

export const buildSearchQuery = (keyWord = "", searchFields = []) => {
  if (typeof searchFields === "string") {
    searchFields = searchFields.split(",");
  }
  if (!keyWord || !Array.isArray(searchFields) || searchFields.length === 0)
    return null;
  const regex = new RegExp(keyWord, "i");
  const orConditions = searchFields.map((field) => ({
    [field]: { $regex: regex },
  }));
  return { $or: orConditions };
};

export const buildPopulateFields = (populateStr = "") => {
  if (!populateStr) return [];

    if (Array.isArray(populateStr)) return populateStr;


  const parseEntry = (pathParts, fields) => {
    if (pathParts.length === 0) return null;
    const [currentPath, ...restPath] = pathParts;
    const populateObj = { path: currentPath };
    if (restPath.length === 0) {
      if (fields) populateObj.select = fields.replace(/,/g, " ");
    } else {
      populateObj.populate = [parseEntry(restPath, fields)];
    }
    return populateObj;
  };

  const mergePopulate = (target, source) => {
    if (!target.populate) target.populate = [];
    for (const src of source) {
      const existing = target.populate.find((p) => p.path === src.path);
      if (existing) {
        if (src.select) existing.select = src.select;
        if (src.populate) mergePopulate(existing, src.populate);
      } else {
        target.populate.push(src);
      }
    }
  };

  const rootPopulateMap = new Map();
  populateStr.split("|").forEach((entry) => {
    const [path, fields] = entry.split(":");
    const pathParts = path.trim().split(".");
    const populateObj = parseEntry(pathParts, fields);
    if (!populateObj) return;
    const key = populateObj.path;
    if (!rootPopulateMap.has(key)) {
      rootPopulateMap.set(key, populateObj);
    } else {
      const existing = rootPopulateMap.get(key);
      mergePopulate(existing, populateObj.populate || []);
      if (populateObj.select) existing.select = populateObj.select;
    }
  });
  return Array.from(rootPopulateMap.values());
};

export const createDocument = async (Model, data) => {
  try {
    const doc = new Model(data);
    const saved = await doc.save();
    return saved
      ? resultDb(OK, saved)
      : resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  } catch (err) {
    logMessage(
      `Error in Service ${Model.modelName} Create Document : `,
      err,
      "error"
    );
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const findOneByQuery = async (Model, query) => {
  try {
    const doc = await Model.findOne(query);
    return doc ? resultDb(OK, doc) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage("Error in findOneByQuery service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const findOneByQueryWithPopulate = async (
  Model,
  query,
  populateOptions
) => {
  try {
    const doc = await Model.findOne(query).populate(populateOptions).exec();
    return doc ? resultDb(OK, doc) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage("Error in findOneByQueryWithPopulate service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const findOneByQueryLean = async (Model, query) => {
  try {
    const doc = await Model.findOne(query).lean();
    return doc ? resultDb(OK, doc) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage("Error in findOneByQueryLean service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const findOneByQueryLeanWithSelect = async (Model, query, select) => {
  try {
    const doc = await Model.findOne(query).select(select).lean();
    return doc ? resultDb(OK, doc) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage(
      "Error in findOneByQueryLeanWithSelect service : ",
      err,
      "error"
    );
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const findByQueryLeanWithSelect = async (Model, query, select) => {
  try {
    const docs = await Model.find(query).select(select).lean();
    return docs ? resultDb(OK, docs) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage("Error in findByQueryLeanWithSelect service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const findOneByQueryLeanWithPopulateAndSelect = async (
  Model,
  query,
  select,
  populateOptions
) => {
  try {
    const doc = await Model.findOne(query)
      .select(select)
      .populate(populateOptions)
      .lean()
      .exec();
    return doc ? resultDb(OK, doc) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage(
      "Error in findOneByQueryLeanWithPopulateAndSelect service : ",
      err,
      "error"
    );

    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const findByQueryLeanWithPopulateAndSelect = async (
  Model,
  query,
  select,
  populateOptions
) => {
  try {
    const docs = await Model.find(query)
      .select(select)
      .populate(populateOptions)
      .lean();
    return docs ? resultDb(OK, docs) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage(
      "Error in findByQueryLeanWithPopulateAndSelect service : ",
      err,
      "error"
    );

    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const updateDocument = async (
  Model,
  _id,
  data,
  isFromCrud = BOOLEAN_FALSE,
  extraQuery = {}
) => {
  try {
    let query = { _id, ...extraQuery };

    if (isFromCrud) {
      query.isDeleted = BOOLEAN_FALSE;
    }

    const updated = await Model.findOneAndUpdate(
      query,
      { $set: data },
      { new: true }
    );
    return updated ? resultDb(OK, updated) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage(
      `Error in Service ${Model.modelName} Update Document : `,
      err,
      "error"
    );

    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const updateOneByQueryLean = async (Model, query, updateData) => {
  try {
    const updated = await Model.findOneAndUpdate(query, updateData, {
      new: true,
    }).lean();
    return updated ? resultDb(OK, updated) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage("Error in updateOneByQueryLean service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const updateDocumentByQueryAndData = async (
  Model,
  query,
  data,
  forceSet = true
) => {
  try {
    let updateOperation;
    if (forceSet) {
      updateOperation = { $set: data };
    } else {
      updateOperation = data;
    }
    const updated = await Model.findOneAndUpdate(query, updateOperation, {
      new: true,
    });
    return updated ? resultDb(OK, updated) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage(
      "Error in updateDocumentByQueryAndData service : ",
      err,
      "error"
    );
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const updateFieldById = async (Model, id, fieldName, value) => {
  try {
    const updated = await Model.findOneAndUpdate(
      { _id: id },
      { [fieldName]: value },
      { new: true }
    );
    return updated ? resultDb(OK, updated) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage("Error in updateFieldById service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const updateMultipleDocumentByQueryAndData = async (
  Model,
  query,
  data
) => {
  try {
    const updated = await Model.updateMany(query, { $set: data });
    return updated ? resultDb(OK, updated) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage(
      "Error in updateMultipleDocumentByQueryAndData service : ",
      err,
      "error"
    );

    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const deleteDocument = async (Model, query) => {
  try {
    const deleted = await Model.findOneAndDelete(query);
    return deleted ? resultDb(OK, deleted) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage("Error in deleteDocument service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, err.message);
  }
};

export const softDeleteDocument = async (Model, query) => {
  try {
    const updated = await Model.findOneAndUpdate(
      query,
      { isDeleted: true },
      { new: true }
    );
    return updated ? resultDb(OK, updated) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage("Error in softDeleteDocument service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const getAllDocuments = async (Model, options = {}, builtIn = true) => {
  try {
    const {
      sortBy = "createdAt",
      sortOrder = "desc",
      keyWord = "",
      searchFields = [],
      query = {},
      populate = [],
      select = "",
      fromDate = "",
      toDate = "",
    } = options;

    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    let andConditions = [{ isDeleted: false }];

    if (builtIn) {
      andConditions.push({ isDisable: false });
    }

    if (query && Object.keys(query).length > 0) andConditions.push(query);

    const keywordQuery = buildSearchQuery(keyWord, searchFields);
    if (keywordQuery) andConditions.push(keywordQuery);

    if (fromDate || toDate) {
      const createdAtFilter = {};
      if (fromDate) createdAtFilter.$gte = momentValueFunc(fromDate);
      if (toDate) createdAtFilter.$lte = momentValueFunc(toDate) + 86400000;
      andConditions.push({ createdAt: createdAtFilter });
    }

    const finalQuery =
      andConditions.length === 1 ? andConditions[0] : { $and: andConditions };

    let queryBuilder = Model.find(finalQuery).sort(sort);

    if (select) queryBuilder = queryBuilder.select(select.split(",").join(" "));
    if (Array.isArray(populate))
      populate.forEach((pop) => {
        if (pop.path) queryBuilder = queryBuilder.populate(pop);
      });

    const docs = await queryBuilder;
    const total = await Model.countDocuments(finalQuery);

    return resultDb(OK, { total, list: docs });
  } catch (err) {
    logMessage("Error in getAllDocuments service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, err.message);
  }
};

export const getListDocuments = async (
  Model,
  options = {},
  isDeletedApplicable
) => {
  try {
    const {
      pageNo = 1,
      size = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      keyWord = "",
      searchFields = [],
      query = {},
      populate = [],
      select = "",
      fromDate = "",
      toDate = "",
    } = options;

    const page = parseInt(pageNo);
    const limit = parseInt(size);
    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    let andConditions = [];

    if (isDeletedApplicable) {
      andConditions.push({ isDeleted: false });
    }

    if (query && Object.keys(query).length > 0) andConditions.push(query);

    const keywordQuery = buildSearchQuery(keyWord, searchFields);
    if (keywordQuery) andConditions.push(keywordQuery);

    if (fromDate || toDate) {
      const createdAtFilter = {};
      if (fromDate) createdAtFilter.$gte = momentValueFunc(fromDate);
      if (toDate) createdAtFilter.$lte = momentValueFunc(toDate) + 86400000;
      andConditions.push({ createdAt: createdAtFilter });
    }

    const finalQuery =
      andConditions.length === 1 ? andConditions[0] : { $and: andConditions };

    let queryBuilder = Model.find(finalQuery)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    if (select) queryBuilder = queryBuilder.select(select.split(",").join(" "));
    if (Array.isArray(populate))
      populate.forEach((pop) => {
        if (pop.path) queryBuilder = queryBuilder.populate(pop);
      });

    const total = await Model.countDocuments(finalQuery);
    const docs = await queryBuilder;

    return resultDb(OK, { total, page, size: limit, list: docs });
  } catch (err) {
    logMessage("Error in getListDocuments service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, err.message);
  }
};

export const executeAggregation = async (Model, pipeline = []) => {
  try {
    const results = await Model.aggregate(pipeline);
    return resultDb(OK, results);
  } catch (err) {
    logMessage("Error in executeAggregation service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, err.message);
  }
};

export const findDistinctIdsByQuery = async (Model, query, field = "_id") => {
  try {
    const ids = await Model.find(query).distinct(field);
    return ids?.length ? resultDb(OK, ids) : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage("Error in findDistinctIdsByQuery service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const createMultipleDocuments = async (Model, dataArray) => {
  try {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      return resultDb(BAD_REQUEST, DATA_NULL);
    }

    const savedDocs = await Model.insertMany(dataArray);
    return resultDb(OK, savedDocs);
  } catch (err) {
    logMessage(
      `
      Error in Service ${Model.modelName} Create Multiple Documents : `,
      err,
      "error"
    );

    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const updateMultipleDocumentByQuery = async (
  Model,
  query,
  updatingQuery
) => {
  try {
    const updated = await Model.updateMany(query, updatingQuery);
    return updated.matchedCount
      ? resultDb(OK, updated)
      : resultDb(NOT_FOUND, DATA_NULL);
  } catch (err) {
    logMessage(
      `
      Error in Service ${Model.modelName} Update Multiple Documents By Query : `,
      err,
      "error"
    );
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};

export const countDocumentsByQuery = async (Model, query) => {
  try {
    const count = await Model.countDocuments(query);
    return count > 0 ? resultDb(OK, count) : resultDb(NOT_FOUND, 0);
  } catch (err) {
    logMessage("Error in countDocumentsByQuery service : ", err, "error");
    return resultDb(INTERNAL_SERVER_ERROR, DATA_NULL);
  }
};
