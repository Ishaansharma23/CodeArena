# CodeArena

Where Code Meets Competition.

![CodeArena UI](/frontend/public/screenshot-for-readme.png)

## Highlights

- 🧑‍💻 VSCode-Powered Code Editor
- 🔐 Authentication via Clerk
- 🎥 1-on-1 Video Interview Rooms
- 🧭 Dashboard with Live Stats
- 🔊 Mic & Camera Toggle, Screen Sharing & Recording
- 💬 Real-time Chat Messaging
- ⚙️ Secure Code Execution in Isolated Environment
- 🎯 Auto Feedback — Success / Fail based on test cases
- 🎉 Confetti on Success + Notifications on Fail
- 🧩 Practice Problems Page (solo coding mode)
- 🔒 Room Locking — allows only 2 participants
- 🧠 Background Jobs with Inngest (async tasks)
- 🧰 REST API with Node.js & Express
- ⚡ Data Fetching & Caching via TanStack Query
- 🤖 CodeRabbit for PR Analysis & Code Optimization
- 🧑‍💻 Git & GitHub Workflow (branches, PRs, merges)
- 🚀 Deployment on Sevalla (free-tier friendly)

## What You Can Do

- Create or join real-time interview rooms with live video + chat.
- Practice coding problems with a Monaco (VS Code) editor and Piston-powered execution.
- Run AI interviews driven by resume context and dynamic follow-up questions.
- Review session stats, history, and performance feedback.

## Tech Stack

**Frontend**
- React + Vite
- Clerk (auth UI)
- Stream Video SDK (video calls) + Stream Chat
- Monaco Editor (VS Code-like editor)
- TanStack Query (data caching)
- Tailwind CSS + DaisyUI

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- Clerk (auth middleware)
- Stream (video + chat orchestration)
- Inngest (background jobs)
- LangChain + Gemini (AI interview engine)
- Pinecone (resume vector search, optional)

**Code Execution**
- Piston API (sandboxed execution)

## Project Structure

```
backend/    # Express API, DB models, background jobs
frontend/   # React app + Vite
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB connection string
- Clerk, Stream, and Inngest keys

### Backend Environment Variables

Create a `.env` file in the project root or `backend/`.

```bash
PORT=3000
NODE_ENV=development

DB_URL=your_mongodb_connection_url

INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

CLIENT_URL=http://localhost:5173

# AI interview (optional but recommended)
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash
GEMINI_FALLBACK_MODEL=gemini-1.5-pro
GEMINI_TEMPERATURE=0.6
MAX_INTERVIEW_QUESTIONS=12

# Resume vector search (optional)
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index
PINECONE_NAMESPACE_PREFIX=codearena
```

### Frontend Environment Variables

Create `frontend/.env`.

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your_stream_api_key
```

## Install & Run

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Build

```bash
npm run build --prefix frontend
```

## Notes

- Resume uploads are PDF-only and capped at 5MB.
- Set `CLIENT_URL` to the Vite host so CORS and Clerk work correctly.
- If you skip Pinecone or Gemini keys, AI/resume features will fall back gracefully.

## Deployment

- Backend and frontend are ready for deployment on Sevalla or any Node/Vite-friendly host.
- Set environment variables in the hosting provider before deploying.
