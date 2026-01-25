import { Router } from "express";
import authorizationRoutes from "./authorization/index.js";
import filesRoutes from "./files/index.js";
import websiteRoutes from "./website/index.js";

const router = Router();

router.get("/health", (req, res) =>
  res.send("Service is healthy for version 1.0"),
);

router.use("/auth", authorizationRoutes);
router.use("/files", filesRoutes);
router.use("/website", websiteRoutes);

export default router;
