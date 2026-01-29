import { Source, Status } from "../../models/index.js";
import { nameStatusController } from "../common.js";

const sourceMessages = {
  create: "Source created successfully",
  update: "Source updated successfully",
  status: "Source status updated successfully",
  delete: "Source deleted successfully",
  exists: "Source already exists",
};

const statusMessages = {
  create: "Status created successfully",
  update: "Status updated successfully",
  status: "Status status updated successfully",
  delete: "Status deleted successfully",
  exists: "Status already exists",
};

export const {
  list: sourceList,
  create: createSource,
  update: updateSource,
  enableDisable: enableDisableSource,
  softDelete: softDeleteSource,
  allDocs: allSources,
} = nameStatusController(Source, sourceMessages, "Source");

export const {
  list: statusList,
  create: createStatus,
  update: updateStatus,
  enableDisable: enableDisableStatus,
  softDelete: softDeleteStatus,
  allDocs: allStatus,
} = nameStatusController(Status, statusMessages, "Status");
