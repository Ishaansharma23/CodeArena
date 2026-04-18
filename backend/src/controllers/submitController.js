import Problem from "../models/Problem.js";

const PISTON_API_URL = "https://emkc.org/api/v2/piston/execute";

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0", extension: "js" },
  python: { language: "python", version: "3.10.0", extension: "py" },
  java: { language: "java", version: "15.0.2", extension: "java" },
};

const buildPistonPayload = (language, code) => {
  const config = LANGUAGE_VERSIONS[language];
  if (!config) return null;

  return {
    language: config.language,
    version: config.version,
    files: [
      {
        name: `main.${config.extension}`,
        content: code,
      },
    ],
  };
};

const runExecution = async (language, code) => {
  const payload = buildPistonPayload(language, code);

  if (!payload) {
    return {
      ok: false,
      status: "Error",
      error: `Unsupported language: ${language}`,
    };
  }

  const response = await fetch(PISTON_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    return {
      ok: false,
      status: "Error",
      error: data?.message || `Piston error: ${response.status}`,
    };
  }

  const output = data?.run?.output ?? "";
  const stderr = data?.run?.stderr ?? "";

  if (stderr) {
    return {
      ok: false,
      status: "Error",
      error: stderr,
    };
  }

  return {
    ok: true,
    output,
  };
};

export const submitSolution = async (req, res) => {
  try {
    const { code, language, problemId } = req.body || {};

    if (!code || !language || !problemId) {
      return res.status(400).json({ message: "code, language, and problemId are required" });
    }

    const problem = await Problem.findOne({ id: problemId }).select({ testCases: 1 });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    const testCases = problem.testCases || [];
    if (!testCases.length) {
      return res.status(400).json({ message: "No test cases configured for this problem" });
    }

    for (let index = 0; index < testCases.length; index += 1) {
      const testCase = testCases[index];
      const result = await runExecution(language, code);

      if (!result.ok) {
        return res.status(200).json({
          status: "Error",
          error: result.error,
        });
      }

      const actual = String(result.output || "").trim();
      const expected = String(testCase.output || "").trim();

      if (actual !== expected) {
        return res.status(200).json({
          status: "Wrong Answer",
          expected,
          got: actual,
          index,
        });
      }
    }

    return res.status(200).json({ status: "Accepted" });
  } catch (error) {
    console.error("Error in submitSolution controller:", error);
    return res.status(500).json({ message: "Failed to submit solution" });
  }
};
