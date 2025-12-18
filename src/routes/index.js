import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => res.send("Service is healthy for version 1.0"));

export default router;
