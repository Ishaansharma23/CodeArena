import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    techStack: {
      type: [String],
      default: [],
    },
    projects: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;
