import express from "express";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoute from "./routes/sessionRoute.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";

const app = express();

const logEnvStatus = () => {
  const geminiStatus = ENV.GEMINI_API_KEY ? "loaded" : "missing";
  const geminiModel = ENV.GEMINI_MODEL || "gemini-1.5-flash-latest";
  const geminiFallback = ENV.GEMINI_FALLBACK_MODEL || "gemini-1.0-pro";
  console.log(
    `[env] GEMINI_API_KEY: ${geminiStatus}, GEMINI_MODEL: ${geminiModel}, GEMINI_FALLBACK_MODEL: ${geminiFallback}`
  );

  if (!ENV.CLIENT_URL) {
    console.warn("[env] CLIENT_URL is not set. CORS will allow localhost only.");
  }

  if (!ENV.DB_URL) {
    console.warn("[env] DB_URL is not set. MongoDB connection will fail.");
  }
};

const __dirname = path.resolve();

// middleware
app.use(express.json());
// credentials:true meaning?? => server allows a browser to include cookies on request
const devOrigins = ["http://localhost:5173", "http://localhost:5174"];
const allowedOrigins = [ENV.CLIENT_URL, ...devOrigins].filter(Boolean);

app.use(
  cors({
    origin: ENV.NODE_ENV === "production" ? ENV.CLIENT_URL : allowedOrigins,
    credentials: true,
  })
);

const authorizedParties = ENV.NODE_ENV === "production" ? [ENV.CLIENT_URL] : devOrigins;
app.use(
  clerkMiddleware({
    authorizedParties: authorizedParties.filter(Boolean),
    debug: ENV.NODE_ENV !== "production",
  })
); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoute);
app.use("/api/resumes", resumeRoutes);
app.use("/api/interviews", interviewRoutes);
  
if (ENV.NODE_ENV !== "production") {
  logEnvStatus();
  app.get("/", (req, res) => {
    res.status(200).json({ msg: "api is up and running" });
  });
}

app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    const port = ENV.PORT || 3000;
    app.listen(port, () => console.log("Server is running on port:", port));
  } catch (error) {
    console.error("💥 Error starting the server", error);
  }
};

startServer();
