import pdf from "pdf-parse";
import Resume from "../models/Resume.js";
import { extractResumeData } from "../lib/resumeParser.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume PDF is required" });
    }

    const parsed = await pdf(req.file.buffer);
    const data = extractResumeData(parsed.text || "");

    const resume = await Resume.create({
      user: req.user._id,
      fileName: req.file.originalname,
      text: data.text,
      skills: data.skills,
      techStack: data.techStack,
      projects: data.projects,
    });

    res.status(201).json({ resume });
  } catch (error) {
    console.error("Error in uploadResume controller:", error);
    res.status(500).json({ message: "Failed to upload resume" });
  }
};

export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ resumes });
  } catch (error) {
    console.error("Error in getMyResumes controller:", error);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ resume });
  } catch (error) {
    console.error("Error in getResumeById controller:", error);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};
