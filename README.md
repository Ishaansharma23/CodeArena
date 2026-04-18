# CodeArena

Where Code Meets Competition.

![CodeArena UI](/frontend/public/screenshot-for-readme.png)

## Overview

CodeArena is a modern coding interview and practice platform. It combines a real-time
collaboration workspace (video, chat, and code) with a LeetCode-style problem system, secure
execution, and AI-assisted interview flows.

## Use Cases

- Live pair interviews with video, chat, and a shared code editor.
- Solo practice with Run and Submit workflows against test cases.
- AI-driven mock interviews based on resume context and history.
- Dashboard analytics for sessions and interview performance.

## Key Features

- Monaco (VS Code) editor with multi-language runtime support.
- Public code execution and submission APIs.
- Test-case based verdicts for submissions.
- Real-time video and chat via Stream.
- Resume uploads and parsing for AI interview context.
- Background jobs and async workflows with Inngest.

## Tech Stack and Libraries

Frontend
- React + Vite: SPA and fast dev tooling.
- React Router: client-side routing.
- Monaco Editor: VS Code-like code editor.
- TanStack Query: data fetching and cache management.
- Tailwind CSS + DaisyUI: styling system and UI primitives.
- Stream Video React SDK + Stream Chat React: live video and chat UI.
- Axios: HTTP client for API calls.
- React Hot Toast: notifications.
- React Resizable Panels: split editor and output panels.
- date-fns: time formatting.
- Lucide React: icons.
- Canvas Confetti: success feedback.

Backend
- Node.js + Express: REST API server.
- MongoDB + Mongoose: data storage and schema modeling.
- Clerk (Express): authentication and user verification for protected routes.
- Stream Node SDK + stream-chat: server-side video and chat orchestration.
- Inngest: background jobs for user sync and workflows.
- LangChain + Google Generative AI: AI interview engine.
- Pinecone: optional vector search for resume context.
- Multer + pdf-parse: resume upload and PDF parsing.
- Piston API: sandboxed code execution (proxied via backend).

## API Overview

Public endpoints
- POST /api/execute
- POST /api/submit
- GET /api/problems
- GET /api/problems/:id

Protected endpoints (Clerk required)
- /api/chat
- /api/sessions
- /api/resumes
- /api/interviews

## Problem Workflow

Run
- Calls POST /api/execute
- Returns raw program output

Submit
- Calls POST /api/submit
- Runs all test cases on the backend
- Returns Accepted, Wrong Answer, or Error

## Folder Structure

```
backend/
	scripts/
	src/
		controllers/
		lib/
		middleware/
		models/
		routes/
		server.js
frontend/
	public/
	src/
		api/
		components/
		data/
		hooks/
		lib/
		pages/
```

## Getting Started

Prerequisites
- Node.js 18+
- MongoDB connection string
- Clerk, Stream, and Inngest keys

Backend environment variables

Create a .env file in the project root or backend/.

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

# AI interview (optional)
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

Frontend environment variables

Create frontend/.env.

```bash
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_URL=http://localhost:3000/api
VITE_STREAM_API_KEY=your_stream_api_key
```

Install and run

Backend
```bash
cd backend
npm install
npm run dev
```

Frontend
```bash
cd frontend
npm install
npm run dev
```

Seed problems

```bash
npm run seed:problems --prefix backend
```

Build

```bash
npm run build --prefix frontend
```

## Notes

- Resume uploads are PDF-only and capped at 5MB.
- Set CLIENT_URL to the Vite host so CORS and Clerk work correctly.
- If Pinecone or Gemini keys are missing, AI and vector features fall back gracefully.

## Deployment

- Deploy the backend and frontend on any Node and Vite compatible host.
- Ensure all environment variables are configured in the hosting provider.
