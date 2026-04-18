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

export async function executeCode(req, res) {
  try {
    const { language, code } = req.body || {};
    const shouldLog = process.env.NODE_ENV !== "production";

    if (shouldLog) {
      console.log("🔥 [execute] request", {
        ip: req.ip,
        language,
      });
    }

    if (!language || typeof code !== "string") {
      return res.status(400).json({ message: "language and code are required" });
    }

    const payload = buildPistonPayload(language, code);

    if (!payload) {
      return res.status(400).json({ message: `Unsupported language: ${language}` });
    }

    const response = await fetch(PISTON_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("🔥 Piston status:", response.status);

    const data = await response.json().catch(() => ({}));
    console.log("🔥 Piston response:", data);

    const output = data?.run?.output || "";
    const stderr = data?.run?.stderr || "";

    return res.status(200).json({
      run: {
        output,
        stderr,
      },
    });

  } catch (error) {
    console.error("💥 Execute error:", error);
    return res.status(500).json({
      run: {
        output: "",
        stderr: error.message,
      },
    });
  }
}