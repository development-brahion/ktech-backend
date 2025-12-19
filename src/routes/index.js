import { Router } from "express";
import authorizationRoutes from "./authorization/index.js";

const router = Router();

router.get("/health", (req, res) =>
  res.send("Service is healthy for version 1.0")
);

router.use("/auth", authorizationRoutes);

export default router;
