import Interview from "../models/Interview.js";
import Resume from "../models/Resume.js";
import { ENV } from "../lib/env.js";
import { generateFinalReport, generateNextQuestion } from "../lib/ai/interviewEngine.js";

const buildPastSummaries = (interviews) =>
  interviews
    .map((interview) => interview.report?.summary)
    .filter(Boolean)
    .join("\n");

const buildTranscript = (history) =>
  history
    .map((item) => `${item.role === "user" ? "Candidate" : "Interviewer"}: ${item.content}`)
    .join("\n");

const maxQuestions = Math.max(Number(ENV.MAX_INTERVIEW_QUESTIONS || 12), 12);

export const startInterview = async (req, res) => {
  try {
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: "resumeId is required" });
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const pastInterviews = await Interview.find({
      user: req.user._id,
      status: "completed",
      report: { $ne: null },
    })
      .sort({ endedAt: -1 })
      .limit(3)
      .lean();

    const pastSummaries = buildPastSummaries(pastInterviews);

    const questionPayload = await generateNextQuestion({
      resumeText: resume.text,
      resumeMeta: {
        skills: resume.skills,
        techStack: resume.techStack,
        projects: resume.projects,
      },
      pastSummaries,
      history: [],
      lastAnswer: null,
      questionCount: 0,
    });

    const interview = await Interview.create({
      user: req.user._id,
      resume: resume._id,
      history: [{ role: "assistant", content: questionPayload.question }],
      questions: [
        {
          question: questionPayload.question,
          category: questionPayload.category,
          difficulty: questionPayload.difficulty,
        },
      ],
    });

    res.status(201).json({ interview, question: questionPayload.question });
  } catch (error) {
    console.error("Error in startInterview controller:", error);
    res.status(500).json({ message: error.message || "Failed to start interview" });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ message: "Answer is required" });
    }

    const interview = await Interview.findOne({ _id: id, user: req.user._id });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.status !== "in_progress") {
      return res.status(400).json({ message: "Interview is already completed" });
    }

    const lastQuestion = interview.questions[interview.questions.length - 1];
    if (lastQuestion && !lastQuestion.answer) {
      lastQuestion.answer = answer;
    }

    interview.history.push({ role: "user", content: answer });

    if (interview.questions.length >= maxQuestions) {
      await interview.save();
      return res.status(200).json({
        interviewId: interview._id,
        isComplete: true,
        message: "Maximum questions reached. End the interview to get the report.",
      });
    }

    const resume = await Resume.findById(interview.resume);

    const pastInterviews = await Interview.find({
      user: req.user._id,
      status: "completed",
      report: { $ne: null },
    })
      .sort({ endedAt: -1 })
      .limit(3)
      .lean();

    const pastSummaries = buildPastSummaries(pastInterviews);

    const nextQuestion = await generateNextQuestion({
      resumeText: resume?.text || "",
      resumeMeta: resume
        ? {
            skills: resume.skills,
            techStack: resume.techStack,
            projects: resume.projects,
          }
        : null,
      pastSummaries,
      history: interview.history,
      lastAnswer: answer,
      questionCount: interview.questions.length,
    });

    interview.questions.push({
      question: nextQuestion.question,
      category: nextQuestion.category,
      difficulty: nextQuestion.difficulty,
    });

    interview.history.push({ role: "assistant", content: nextQuestion.question });

    await interview.save();

    res.status(200).json({
      interviewId: interview._id,
      question: nextQuestion.question,
      category: nextQuestion.category,
      difficulty: nextQuestion.difficulty,
      isComplete: false,
    });
  } catch (error) {
    console.error("Error in submitAnswer controller:", error);
    res.status(500).json({ message: error.message || "Failed to submit answer" });
  }
};

export const endInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const interview = await Interview.findOne({ _id: id, user: req.user._id });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    if (interview.status === "completed" && interview.report) {
      return res.status(200).json({ interview, report: interview.report });
    }

    const resume = await Resume.findById(interview.resume);
    const transcript = buildTranscript(interview.history);

    const report = await generateFinalReport({
      resumeText: resume?.text || "",
      transcript,
    });

    interview.report = report;
    interview.status = "completed";
    interview.endedAt = new Date();

    await interview.save();

    res.status(200).json({ interview, report });
  } catch (error) {
    console.error("Error in endInterview controller:", error);
    res.status(500).json({ message: error.message || "Failed to end interview" });
  }
};

export const getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id }).populate(
      "resume",
      "skills techStack projects fileName createdAt"
    );

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json({ interview });
  } catch (error) {
    console.error("Error in getInterviewById controller:", error);
    res.status(500).json({ message: error.message || "Failed to fetch interview" });
  }
};

export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.status(200).json({ report: interview.report, interviewId: interview._id });
  } catch (error) {
    console.error("Error in getInterviewReport controller:", error);
    res.status(500).json({ message: error.message || "Failed to fetch report" });
  }
};

export const getMyInterviewHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({ user: req.user._id, status: "completed" })
      .sort({ endedAt: -1 })
      .limit(20)
      .select("report endedAt resume status startedAt questions createdAt")
      .populate("resume", "fileName")
      .lean();

    const normalized = interviews.map((interview) => ({
      ...interview,
      questionCount: interview.questions?.length || 0,
      questions: undefined,
    }));

    res.status(200).json({ interviews: normalized });
  } catch (error) {
    console.error("Error in getMyInterviewHistory controller:", error);
    res.status(500).json({ message: error.message || "Failed to fetch interview history" });
  }
};
