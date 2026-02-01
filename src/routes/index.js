import { Router } from "express";
import authorizationRoutes from "./authorization/index.js";
import filesRoutes from "./files/index.js";
import websiteRoutes from "./website/index.js";
import coursesRoutes from "./courses/index.js";
import inquireRoutes from "./inquires/index.js";
import employeeRoutes from "./employee/index.js";
import studentRoutes from "./student/index.js";
import commerceRoutes from "./commerce/index.js";
import userRoutes from "./user/index.js";

const router = Router();

router.get("/health", (req, res) =>
  res.send("Service is healthy for version 1.0"),
);

router.use("/auth", authorizationRoutes);
router.use("/files", filesRoutes);
router.use("/website", websiteRoutes);
router.use("/courses", coursesRoutes);
router.use("/inquires", inquireRoutes);
router.use("/employee", employeeRoutes);
router.use("/students", studentRoutes);
router.use("/commerce", commerceRoutes);
router.use("/users",userRoutes)

export default router;
