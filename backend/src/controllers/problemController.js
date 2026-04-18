import Problem from "../models/Problem.js";

const baseProjection = {
  _id: 0,
  __v: 0,
  testCases: 0,
};

export const getProblems = async (_req, res) => {
  try {
    const problems = await Problem.find({}, baseProjection).sort({ createdAt: -1 });
    res.status(200).json({ problems });
  } catch (error) {
    console.error("Error in getProblems controller:", error);
    res.status(500).json({ message: "Failed to fetch problems" });
  }
};

export const getProblemById = async (req, res) => {
  try {
    const { id } = req.params;
    const problem = await Problem.findOne({ id }, baseProjection);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.status(200).json({ problem });
  } catch (error) {
    console.error("Error in getProblemById controller:", error);
    res.status(500).json({ message: "Failed to fetch problem" });
  }
};

