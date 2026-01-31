import { Inquiry } from "../../models/index.js";
import { apiHTTPResponse, logMessage } from "../../utils/globalFunction.js";
import { crudController } from "../common.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";
import {
  findOneByQueryLean,
  updateDocumentByQueryAndData,
} from "../../services/serviceGlobal.js";


