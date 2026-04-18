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
import executeRoutes from "./routes/executeRoutes.js";
import problemRoutes from "./routes/problemRoutes.js";
import submitRoutes from "./routes/submitRoutes.js";

const app = express();
const __dirname = path.resolve();

// middleware
app.use(express.json());

const devOrigins = ["http://localhost:5173", "http://localhost:5174"];
const allowedOrigins = [ENV.CLIENT_URL, ...devOrigins].filter(Boolean);

app.use(
  cors({
    origin: ENV.NODE_ENV === "production" ? ENV.CLIENT_URL : allowedOrigins,
    credentials: true,
  })
);

// 🔥 PUBLIC ROUTES (NO AUTH)
app.use("/api/execute", executeRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submit", submitRoutes);

// 🔐 PROTECTED ROUTES (WITH AUTH)
app.use(
  "/api/chat",
  clerkMiddleware({ debug: ENV.NODE_ENV !== "production" }),
  chatRoutes
);

app.use(
  "/api/sessions",
  clerkMiddleware({ debug: ENV.NODE_ENV !== "production" }),
  sessionRoute
);

app.use(
  "/api/resumes",
  clerkMiddleware({ debug: ENV.NODE_ENV !== "production" }),
  resumeRoutes
);

app.use(
  "/api/interviews",
  clerkMiddleware({ debug: ENV.NODE_ENV !== "production" }),
  interviewRoutes
);

// inngest
app.use("/api/inngest", serve({ client: inngest, functions }));

// health
app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

// dev route
if (ENV.NODE_ENV !== "production") {
  app.get("/", (req, res) => {
    res.status(200).json({ msg: "api is up and running" });
  });
}

// production
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// start server
const startServer = async () => {
  try {
    await connectDB();
    const port = ENV.PORT || 3000;
    app.listen(port, () => console.log("Server running on:", port));
  } catch (error) {
    console.error("💥 Error starting server", error);
  }
};

startServer();