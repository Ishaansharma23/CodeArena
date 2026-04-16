# Production AI Interview Flow

## 1. Frontend Flow

### User Actions
1. User uploads resume from upload resume page.
2. User opens interview page and selects a resume.
3. User clicks Start Interview.
4. App creates interview via API and redirects to live interview page.
5. User answers by typing or browser speech recognition.
6. AI response is spoken via SpeechSynthesis and shown as subtitles.
7. User can toggle mic/camera and end interview.
8. After ending, user opens report and interview history.

### Components
- Start screen: frontend/src/pages/InterviewPage.jsx
- Live interview screen: frontend/src/pages/LiveInterviewPage.jsx
- AI avatar: frontend/src/components/AiAvatar.jsx
- Report page: frontend/src/pages/ReportPage.jsx
- History list: frontend/src/components/InterviewHistory.jsx

### Data Flow
1. `useStartInterview` calls `/api/interviews/start`.
2. Start response contains `interview._id` + initial question.
3. Live page posts answers to `/api/interviews/:id/answer`.
4. End action posts to `/api/interviews/:id/end`.
5. Report + transcript fetched from `/api/interviews/:id` and `/api/interviews/:id/report`.
6. Full history fetched from `/api/interviews/history`.

## 2. Backend Flow

### API Routes
- POST `/api/resumes/upload`
- GET `/api/resumes/mine`
- POST `/api/interviews/start`
- POST `/api/interviews/:id/answer`
- POST `/api/interviews/:id/end`
- GET `/api/interviews/:id`
- GET `/api/interviews/:id/report`
- GET `/api/interviews/history`

### Controllers
- Resume upload + parse + vector index: backend/src/controllers/resumeController.js
- Interview orchestration: backend/src/controllers/interviewController.js

### LangChain Usage
- Prompt templates and memory in backend/src/lib/ai/interviewEngine.js
- `ChatPromptTemplate` for question and report prompts
- `BufferMemory` for short-term conversational continuity
- Model fallback logic for resilient generation

### Pinecone Integration
- Pinecone client setup: backend/src/lib/pinecone.js
- Embeddings setup: backend/src/lib/embeddings.js
- Resume chunking: backend/src/lib/textChunking.js
- Vector index/retrieval logic: backend/src/lib/resumeVectors.js

## 3. AI Flow

### Resume to Embeddings
1. Resume PDF parsed into text.
2. Resume data chunked into skills/tech/projects/body chunks.
3. Embeddings created via GoogleGenerativeAIEmbeddings.
4. Vectors upserted to Pinecone namespace `resume-{resumeId}`.

### Conditional Retrieval (Only Project Stage)
- For questionCount 3 to 5:
1. Build semantic query from stage + last answer + summaries.
2. Query Pinecone top chunks.
3. Inject only retrieved chunks into prompt context.
4. Avoid sending full resume text in this stage.

- For all other stages:
- Use direct resume text/highlights without Pinecone retrieval.

### Prompt and Model Output
1. Stage-aware prompt is generated from questionCount.
2. Model returns strict JSON `{ question, category, difficulty }`.
3. Response validated and fallback applied if malformed.

## 4. Memory Design

### Short-Term Memory
- BufferMemory in interviewEngine keeps in-session dialogue context.

### Long-Term Memory
- MongoDB Interview model stores:
- full transcript history
- question and answer log
- final report
- metadata and timestamps

### Vector Memory
- Pinecone stores resume chunks for semantic retrieval.
- Current design uses vectors only for project deep-dive stage.
- Optional future layer: store answer embeddings for weakness recall.

## 5. End-to-End Sequence

1. User uploads resume.
2. Backend parses and stores resume in MongoDB.
3. Backend chunks and embeds resume, upserts vectors to Pinecone.
4. User starts interview.
5. Backend generates stage-aware question 0 (intro).
6. User answers.
7. Backend updates transcript and question count.
8. For questionCount 3-5, backend retrieves project chunks from Pinecone and asks deep project questions.
9. For other counts, backend follows structured stages without Pinecone retrieval.
10. User ends interview.
11. Backend generates report and stores completion state.
12. Frontend shows overview, scores, transcript, and persistent history.

## 6. Scalability Notes

- Pinecone retrieval is conditionally invoked to reduce cost and latency.
- Resume vectors are indexed once at upload time.
- API responses keep stable shape for frontend predictability.
- Interview history endpoint returns all completed interviews for analytics-ready UI.
