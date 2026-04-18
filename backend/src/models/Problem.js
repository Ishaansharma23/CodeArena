import mongoose from "mongoose";

const descriptionSchema = new mongoose.Schema(
  {
    text: { type: String, default: "" },
    notes: { type: [String], default: [] },
  },
  { _id: false }
);

const exampleSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    output: { type: String, default: "" },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const starterCodeSchema = new mongoose.Schema(
  {
    javascript: { type: String, default: "" },
    python: { type: String, default: "" },
    java: { type: String, default: "" },
  },
  { _id: false }
);

const testCaseSchema = new mongoose.Schema(
  {
    input: { type: String, default: "" },
    output: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    category: { type: String, default: "" },
    description: { type: descriptionSchema, default: undefined },
    examples: { type: [exampleSchema], default: [] },
    constraints: { type: [String], default: [] },
    starterCode: { type: starterCodeSchema, required: true },
    testCases: { type: [testCaseSchema], default: [] },
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", problemSchema);

export default Problem;
