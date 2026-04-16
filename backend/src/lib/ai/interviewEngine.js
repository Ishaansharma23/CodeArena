import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { BufferMemory } from "langchain/memory";

import { ENV } from "../env.js";
import { retrieveResumeContext } from "../resumeVectors.js";

const primaryModelName = ENV.GEMINI_MODEL || "gemini-1.5-flash";
const fallbackModelName = ENV.GEMINI_FALLBACK_MODEL || "gemini-1.5-pro";
const safeModelName = "gemini-1.5-flash";

const MAX_INPUT_CHARS = 12000;

const pickDifficulty = (answerQuality, base = "medium") => {
  if (answerQuality === "strong") return "hard";
  if (answerQuality === "weak") return "easy";
  return base;
};

const normalizeQuestion = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getRecentAssistantQuestions = (history = [], count = 4) =>
  history
    .filter((item) => item.role === "assistant" && item.content)
    .slice(-count)
    .map((item) => item.content);

const isQuestionRepeated = (candidate, recentQuestions = []) => {
  const normalizedCandidate = normalizeQuestion(candidate);
  if (!normalizedCandidate) return false;

  return recentQuestions.some((question) => {
    const normalizedQuestion = normalizeQuestion(question);
    if (!normalizedQuestion) return false;
    if (normalizedCandidate === normalizedQuestion) return true;
    return (
      normalizedCandidate.includes(normalizedQuestion.slice(0, 24)) ||
      normalizedQuestion.includes(normalizedCandidate.slice(0, 24))
    );
  });
};

const pickResumeCue = (resumeMeta, resumeText) => {
  const firstNonEmpty = (items) =>
    Array.isArray(items) ? items.find((item) => String(item || "").trim()) : "";

  const cue =
    firstNonEmpty(resumeMeta?.projects) ||
    firstNonEmpty(resumeMeta?.skills) ||
    firstNonEmpty(resumeMeta?.techStack) ||
    "";

  if (cue) return String(cue).trim();

  if (!resumeText) return "";

  const line = resumeText
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .find((item) => item.length >= 6 && item.length <= 80);

  return line || "";
};

const buildFallbackQuestion = ({ questionCount, resumeMeta, resumeText, answerQuality, lastAnswer }) => {
  const resumeCue = pickResumeCue(resumeMeta, resumeText);
  const difficulty = pickDifficulty(answerQuality);
  const followUpHint =
    answerQuality === "strong" && lastAnswer
      ? ` Based on your last answer, can you go deeper on that and explain your tradeoffs?`
      : "";

  if (questionCount === 0) {
    return {
      question: "Hi! Welcome to your interview. Introduce yourself.",
      category: "behavioral",
      difficulty: "easy",
    };
  }

  if (questionCount >= 1 && questionCount <= 2) {
    const topic = resumeCue ? ` from your resume: ${resumeCue}` : " from your resume";
    if (questionCount === 1) {
      return {
        question:
          answerQuality === "weak"
            ? "Thanks for introducing yourself. Can you briefly describe your current role and key responsibilities?"
            : `Great intro. What core skills have you used most in your recent work${topic}?`,
        category: "project",
        difficulty,
      };
    }

    return {
      question:
        answerQuality === "weak"
          ? `Could you tell me one technology${topic} that you are most confident with and why?`
          : `I noticed${topic}. Which part did you personally implement and what challenges did you face?${followUpHint}`,
      category: "project",
      difficulty,
    };
  }

  if (questionCount >= 3 && questionCount <= 5) {
    const topic = resumeCue ? `the project or experience: ${resumeCue}` : "a recent project";
    const prompt =
      answerQuality === "weak"
        ? `Give a high-level overview of ${topic} and your role.`
        : `In ${topic}, what problem were you solving and how did you structure the solution?${followUpHint}`;
    return {
      question: prompt,
      category: "project",
      difficulty,
    };
  }

  if (questionCount >= 6 && questionCount <= 8) {
    const technicalQuestions = [
      "Explain how you would find the first non-repeating character in a string.",
      "What is the time complexity of inserting into a hash map, and why?",
      "Design a rate limiter for an API. What approach would you use and why?",
    ];
    const index = (questionCount - 6) % technicalQuestions.length;
    const baseQuestion = technicalQuestions[index];
    const simplified = "Explain what a hash map is and when you would use it.";
    return {
      question: answerQuality === "weak" ? simplified : `${baseQuestion}${followUpHint}`,
      category: "dsa",
      difficulty,
    };
  }

  if (questionCount >= 9 && questionCount <= 10) {
    const behavioralQuestions = [
      "Tell me about a time you received tough feedback and how you handled it.",
      "Describe a time you had a disagreement with a teammate. What did you do?",
    ];
    const index = (questionCount - 9) % behavioralQuestions.length;
    return {
      question: `${behavioralQuestions[index]}${followUpHint}`,
      category: "behavioral",
      difficulty,
    };
  }

  return {
    question: "Thanks for your time today. Do you have any questions for me?",
    category: "behavioral",
    difficulty: "easy",
  };
};

const buildFallbackReport = () => ({
  technicalScore: 5,
  dsaScore: 5,
  communicationScore: 5,
  strengths: ["Shows willingness to learn"],
  weaknesses: ["Needs more depth in technical explanations"],
  suggestions: ["Practice structured problem solving"],
  verdict: "Needs improvement",
  summary: "Incomplete report generated.",
});

const clampText = (label, text) => {
  if (!text) return "";
  if (text.length <= MAX_INPUT_CHARS) return text;
  return `${text.slice(0, MAX_INPUT_CHARS)}\n\n[${label} truncated]`;
};

const parseTemperature = () => {
  const temperature = Number(ENV.GEMINI_TEMPERATURE);
  return Number.isFinite(temperature) ? temperature : undefined;
};

const assessAnswerQuality = (answer) => {
  if (!answer) return "none";
  const trimmed = answer.trim();
  if (!trimmed) return "none";
  const wordCount = trimmed.split(/\s+/).length;

  if (wordCount < 15 || trimmed.length < 80) return "weak";
  if (wordCount > 90 || trimmed.length > 600) return "strong";
  return "ok";
};

const formatResumeHighlights = (resumeMeta) => {
  if (!resumeMeta) return "";
  const formatList = (items, label) => {
    if (!Array.isArray(items) || items.length === 0) return "";
    const unique = Array.from(new Set(items.map((item) => String(item || "").trim()).filter(Boolean)));
    const preview = unique.slice(0, 5).join(", ");
    return preview ? `${label}: ${preview}` : "";
  };

  return [
    formatList(resumeMeta.skills, "Skills"),
    formatList(resumeMeta.techStack, "Tech stack"),
    formatList(resumeMeta.projects, "Projects"),
  ]
    .filter(Boolean)
    .join("\n");
};

const getInterviewStage = (questionCount = 0) => {
  if (questionCount === 0) return "intro";
  if (questionCount >= 1 && questionCount <= 2) return "background";
  if (questionCount >= 3 && questionCount <= 5) return "project";
  if (questionCount >= 6 && questionCount <= 8) return "technical";
  if (questionCount >= 9 && questionCount <= 10) return "behavioral";
  return "closing";
};

const buildProjectPromptContext = async ({ resume, resumeMeta, questionCount, lastAnswer, pastSummaries }) => {
  if (!resume) {
    return {
      context: formatResumeHighlights(resumeMeta),
      source: "resume-highlights",
    };
  }

  let pineconeContext = { chunks: [], context: "", source: "vector-retrieval-skipped" };
  try {
    pineconeContext = await retrieveResumeContext({
      resume,
      questionCount,
      lastAnswer,
      pastSummaries,
    });
  } catch (error) {
    console.warn("Project context fallback enabled:", error?.message || error);
  }

  if (pineconeContext.context) {
    return pineconeContext;
  }

  return {
    context: formatResumeHighlights(resumeMeta),
    source: pineconeContext.source || "resume-highlights",
  };
};

const buildStageContext = async ({ stage, resumeText, resumeMeta, resume, questionCount, lastAnswer, pastSummaries }) => {
  const highlights = formatResumeHighlights(resumeMeta);

  if (stage === "project") {
    return buildProjectPromptContext({
      resume,
      resumeMeta,
      questionCount,
      lastAnswer,
      pastSummaries,
    });
  }

  const trimmedResume = resumeText ? clampText("Resume", resumeText) : "";

  return {
    context: [highlights, trimmedResume].filter(Boolean).join("\n\n"),
    source: "resume-text",
  };
};

const createModel = (modelName) => {
  const temperature = parseTemperature();
  return new ChatGoogleGenerativeAI({
    apiKey: ENV.GEMINI_API_KEY,
    model: modelName,
    ...(temperature !== undefined ? { temperature } : {}),
  });
};

const primaryModel = createModel(primaryModelName);

const isModelNotFoundError = (error) => {
  const message = error?.message || "";
  return (
    message.includes("404") ||
    /not found/i.test(message) ||
    (/model/i.test(message) && /(not supported|unknown|invalid)/i.test(message))
  );
};

const invokeWithModel = async (prompt, params, modelName) => {
  const model = modelName === primaryModelName ? primaryModel : createModel(modelName);
  const chain = prompt.pipe(model);
  return await chain.invoke(params);
};

const invokeWithFallback = async (prompt, params) => {
  try {
    return await invokeWithModel(prompt, params, primaryModelName);
  } catch (error) {
    if (!isModelNotFoundError(error)) {
      throw error;
    }

    if (fallbackModelName && fallbackModelName !== primaryModelName) {
      try {
        return await invokeWithModel(prompt, params, fallbackModelName);
      } catch (fallbackError) {
        if (!isModelNotFoundError(fallbackError)) {
          throw fallbackError;
        }
      }
    }

    if (safeModelName && ![primaryModelName, fallbackModelName].includes(safeModelName)) {
      return await invokeWithModel(prompt, params, safeModelName);
    }

    throw error;
  }
};

const questionPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a professional AI interviewer for a live video interview. Ask ONE question at a time. " +
      "Return ONLY valid JSON with keys: question, category, difficulty. No markdown, no extra text. " +
      "Do NOT repeat the same question. If the answer is weak, rephrase or simplify instead of repeating. " +
      "STRICT FLOW based on questionCount: " +
      "0 = friendly greeting plus 'Introduce yourself'; " +
      "1-2 = background and skills questions; " +
      "3-5 = deep project questions; " +
      "6-8 = technical or DSA questions; " +
      "9-10 = behavioral questions; " +
      ">10 = closing question. " +
      "Keep a conversational tone, personalize from the supplied context, and simplify when answerQuality is weak. " +
      "When answerQuality is strong, ask a deeper follow-up that references the last answer. " +
      "Never ask a random question.",
  ],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

const reportPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an AI interviewer. Generate a final interview report in JSON only. " +
      "Return {\"technicalScore\":0-10,\"dsaScore\":0-10,\"communicationScore\":0-10,\"strengths\":[string],\"weaknesses\":[string],\"suggestions\":[string],\"verdict\":string,\"summary\":string}. ",
  ],
  ["human", "{input}"],
]);

const safeJsonParse = (content) => {
  try {
    return JSON.parse(content);
  } catch {
    const match = content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        return null;
      }
    }
    return null;
  }
};

const toHistoryMessages = async (history, memory) => {
  for (const item of history) {
    if (item.role === "user") {
      await memory.chatHistory.addMessage(new HumanMessage(item.content));
    }
    if (item.role === "assistant") {
      await memory.chatHistory.addMessage(new AIMessage(item.content));
    }
  }
};

export const generateNextQuestion = async ({
  resumeText,
  resumeMeta,
  resume,
  pastSummaries,
  history,
  lastAnswer,
  questionCount,
}) => {
  const stage = getInterviewStage(questionCount);
  const answerQuality = assessAnswerQuality(lastAnswer);
  const recentAssistantQuestions = getRecentAssistantQuestions(history);

  if (!ENV.GEMINI_API_KEY) {
    console.warn("Gemini disabled: GEMINI_API_KEY (or GOOGLE_API_KEY) is not configured.");
    return buildFallbackQuestion({ questionCount, resumeMeta, resumeText, answerQuality, lastAnswer });
  }

  const memory = new BufferMemory({ returnMessages: true, memoryKey: "history" });
  await toHistoryMessages(history, memory);

  const memoryVars = await memory.loadMemoryVariables({});
  const stageContext = await buildStageContext({
    stage,
    resumeText,
    resumeMeta,
    resume,
    questionCount,
    lastAnswer,
    pastSummaries,
  });

  const input = [
    `Interview stage: ${stage}`,
    `Question count: ${questionCount}`,
    `Answer quality: ${answerQuality}`,
    lastAnswer ? `Last answer:\n${clampText("Last answer", lastAnswer)}` : "",
    recentAssistantQuestions.length
      ? `Already asked questions (avoid repeating):\n${recentAssistantQuestions.join("\n")}`
      : "",
    stageContext.context ? `Relevant resume context:\n${stageContext.context}` : "",
    stage !== "project" && resumeMeta?.projects?.length
      ? `Project references:\n${formatResumeHighlights({ projects: resumeMeta.projects })}`
      : "",
    pastSummaries ? `Past interview summaries:\n${clampText("Past summaries", pastSummaries)}` : "",
    "Generate the next interview question now.",
  ]
    .filter(Boolean)
    .join("\n\n");

  let result;

  try {
    result = await invokeWithFallback(questionPrompt, {
      input,
      history: memoryVars.history || [],
    });
  } catch (error) {
    console.warn("Gemini request failed; using fallback question.", error?.message || error);
    return buildFallbackQuestion({ questionCount, resumeMeta, resumeText, answerQuality, lastAnswer });
  }
  const payload = safeJsonParse(result.content || "");

  if (payload?.question) {
    const candidate = {
      question: payload.question,
      category: payload.category || (stage === "technical" ? "dsa" : stage === "behavioral" || stage === "closing" ? "behavioral" : "project"),
      difficulty: payload.difficulty || (stage === "intro" || stage === "background" || stage === "closing" ? "easy" : answerQuality === "strong" ? "hard" : answerQuality === "weak" ? "easy" : "medium"),
    };

    if (!isQuestionRepeated(candidate.question, recentAssistantQuestions)) {
      return candidate;
    }
  }

  const fallbackQuestion = buildFallbackQuestion({
    questionCount,
    resumeMeta,
    resumeText,
    answerQuality,
    lastAnswer,
  });

  if (isQuestionRepeated(fallbackQuestion.question, recentAssistantQuestions)) {
    const nonRepeatedFallback = buildFallbackQuestion({
      questionCount: questionCount + 1,
      resumeMeta,
      resumeText,
      answerQuality,
      lastAnswer,
    });

    if (!isQuestionRepeated(nonRepeatedFallback.question, recentAssistantQuestions)) {
      return nonRepeatedFallback;
    }
  }

  return fallbackQuestion;
};

export const generateFinalReport = async ({ resumeText, transcript }) => {
  if (!ENV.GEMINI_API_KEY) {
    console.warn("Gemini disabled: GEMINI_API_KEY (or GOOGLE_API_KEY) is not configured.");
    return buildFallbackReport();
  }

  const input = [
    `Resume:\n${clampText("Resume", resumeText)}`,
    `Interview transcript:\n${clampText("Transcript", transcript)}`,
    "Generate the final report now.",
  ].join("\n\n");

  let result;

  try {
    result = await invokeWithFallback(reportPrompt, { input });
  } catch (error) {
    console.warn("Gemini request failed; using fallback report.", error?.message || error);
    return buildFallbackReport();
  }
  const payload = safeJsonParse(result.content || "");

  return payload || buildFallbackReport();
};
