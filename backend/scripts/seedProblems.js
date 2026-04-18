import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

import { connectDB } from "../src/lib/db.js";
import Problem from "../src/models/Problem.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const problemsPath = path.resolve(__dirname, "../../frontend/src/data/problems.js");

const loadProblems = async () => {
  const moduleUrl = pathToFileURL(problemsPath).href;
  const { PROBLEMS } = await import(moduleUrl);
  return PROBLEMS || {};
};

const buildTestCases = (problem) => {
  const expectedOutput =
    problem?.expectedOutput?.javascript ||
    problem?.expectedOutput?.python ||
    problem?.expectedOutput?.java ||
    "";

  if (!expectedOutput) return [];

  return [
    {
      input: "",
      output: expectedOutput,
      isHidden: false,
    },
  ];
};

const normalizeProblem = (problem) => ({
  id: problem.id,
  title: problem.title,
  difficulty: problem.difficulty,
  category: problem.category,
  description: problem.description,
  examples: problem.examples || [],
  constraints: problem.constraints || [],
  starterCode: problem.starterCode,
  testCases: buildTestCases(problem),
});

const seed = async () => {
  try {
    await connectDB();
    const problems = await loadProblems();
    const payload = Object.values(problems).map(normalizeProblem);

    await Problem.deleteMany({});
    await Problem.insertMany(payload);

    console.log(`Seeded ${payload.length} problems.`);
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed problems:", error);
    process.exit(1);
  }
};

seed();
