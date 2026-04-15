import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {
  endInterview,
  getInterviewById,
  getInterviewReport,
  getMyInterviewHistory,
  startInterview,
  submitAnswer,
} from "../controllers/interviewController.js";

const router = express.Router();

router.post("/start", protectRoute, startInterview);
router.post("/:id/answer", protectRoute, submitAnswer);
router.post("/:id/end", protectRoute, endInterview);
router.get("/history", protectRoute, getMyInterviewHistory);
router.get("/:id/report", protectRoute, getInterviewReport);
router.get("/:id", protectRoute, getInterviewById);

export default router;
