import express from "express";
import multer from "multer";
import { protectRoute } from "../middleware/protectRoute.js";
import { getMyResumes, getResumeById, uploadResume } from "../controllers/resumeController.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed"));
    }
    cb(null, true);
  },
});

router.post("/upload", protectRoute, upload.single("resume"), uploadResume);
router.get("/mine", protectRoute, getMyResumes);
router.get("/:id", protectRoute, getResumeById);

export default router;
