import { Router } from "express";
import controllers from "../../controller/index.js";
import { validationMiddleware } from "../../middlewares/validationMiddleware.js";
import { uploadFiles } from "../../utils/multerConfig.js";

const router = Router();

router.post(
  "/upload",
  uploadFiles.array("files", 10),
  validationMiddleware("", "", true),
  controllers.filesController.multipleFilesUploader,
);

export default router;
