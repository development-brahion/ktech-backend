import fs from "fs";
import path from "path";
import crypto from "crypto";
import { apiHTTPResponse } from "../../utils/globalFunction.js";
import * as CONSTANTS from "../../utils/constants.js";
import * as CONSTANTS_MSG from "../../utils/constantsMessage.js";

export const multipleFilesUploader = async (req, res) => {
  try {
    const files = req.files;
    const folderName = req.body.module || "default";

    if (!files || !files.length) {
      return apiHTTPResponse(
        req,
        res,
        CONSTANTS.HTTP_BAD_REQUEST,
        "No files uploaded",
        CONSTANTS.DATA_NULL,
        CONSTANTS.BAD_REQUEST,
      );
    }

    const safeFolder = folderName.replace(/[^a-zA-Z0-9-_]/g, "");

    const baseUploadDir = path.join(process.cwd(), "uploads");
    const targetDir = path.join(baseUploadDir, safeFolder);

    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const uploadedFiles = files.map((file) => {
      const ext = path.extname(file.originalname);
      const uniqueName = `${crypto.randomUUID()}${ext}`;
      const fullPath = path.join(targetDir, uniqueName);

      fs.writeFileSync(fullPath, file.buffer);

      return {
        filename: file.originalname,
        path: `uploads/${safeFolder}/${uniqueName}`,
        mimetype: file.mimetype,
        url: `${process.env.BASE_URL}/uploads/${safeFolder}/${uniqueName}`,
      };
    });

    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_OK,
      "Files uploaded successfully",
      uploadedFiles,
      CONSTANTS.OK,
    );
  } catch (error) {
    console.error("File upload error:", error);
    return apiHTTPResponse(
      req,
      res,
      CONSTANTS.HTTP_INTERNAL_SERVER_ERROR,
      "File upload failed",
      CONSTANTS.DATA_NULL,
      CONSTANTS.INTERNAL_SERVER_ERROR,
    );
  }
};
