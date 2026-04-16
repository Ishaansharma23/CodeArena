import { getEmbeddingsClient } from "./embeddings.js";
import { buildResumeChunks } from "./textChunking.js";
import { buildResumeNamespace, getPineconeIndex, isPineconeConfigured } from "./pinecone.js";

const MAX_QUERY_CHUNKS = 4;

const uniqueByText = (chunks) => {
  const seen = new Set();
  return chunks.filter((chunk) => {
    const key = chunk.text.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const indexResumeVectors = async (resume) => {
  try {
    if (!isPineconeConfigured()) {
      return { indexed: false, reason: "pinecone-not-configured" };
    }

    const embeddings = getEmbeddingsClient();
    const index = await getPineconeIndex();

    if (!embeddings || !index) {
      return { indexed: false, reason: "pinecone-initialization-failed" };
    }

    const chunks = buildResumeChunks(resume.text, {
      skills: resume.skills,
      techStack: resume.techStack,
      projects: resume.projects,
    }).map((chunk, indexValue) => ({
      ...chunk,
      chunkIndex: typeof chunk.chunkIndex === "number" ? chunk.chunkIndex : indexValue,
    }));

    if (!chunks.length) {
      return { indexed: false, reason: "no-resume-chunks" };
    }

    const namespace = buildResumeNamespace(resume._id.toString());
    const texts = chunks.map((chunk) => chunk.text);
    const embeddingsArray = await embeddings.embedDocuments(texts);
    const vectors = chunks.map((chunk, indexValue) => ({
      id: `${resume._id}:${chunk.section}:${chunk.chunkIndex}`,
      values: embeddingsArray[indexValue],
      metadata: {
        userId: resume.user.toString(),
        resumeId: resume._id.toString(),
        fileName: resume.fileName || "",
        section: chunk.section,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        source: "resume",
      },
    }));

    await index.namespace(namespace).upsert(vectors);

    return { indexed: true, chunkCount: vectors.length, namespace };
  } catch (error) {
    console.warn("Resume vector indexing skipped:", error?.message || error);
    return { indexed: false, reason: "vector-indexing-failed" };
  }
};

export const retrieveResumeContext = async ({ resume, questionCount, lastAnswer, pastSummaries }) => {
  try {
    if (!isPineconeConfigured()) {
      return { chunks: [], context: "", source: "pinecone-not-configured" };
    }

    const embeddings = getEmbeddingsClient();
    const index = await getPineconeIndex();

    if (!embeddings || !index) {
      return { chunks: [], context: "", source: "pinecone-initialization-failed" };
    }

    const namespace = buildResumeNamespace(resume._id.toString());
    const queryText = [
      "Focus on projects, tech stack, implementation details, architecture, and impact.",
      lastAnswer ? `Candidate answer context: ${lastAnswer}` : "",
      pastSummaries ? `Past interview summaries: ${pastSummaries}` : "",
      `Stage questionCount: ${questionCount}`,
    ]
      .filter(Boolean)
      .join("\n");

    const vector = await embeddings.embedQuery(queryText);
    const result = await index.namespace(namespace).query({
      vector,
      topK: MAX_QUERY_CHUNKS,
      includeMetadata: true,
    });

    const chunks = uniqueByText(
      (result.matches || [])
        .map((match) => ({
          score: match.score,
          text: match.metadata?.text || "",
          section: match.metadata?.section || "resumeText",
          chunkIndex: match.metadata?.chunkIndex ?? 0,
        }))
        .filter((item) => item.text)
    );

    return {
      chunks,
      context: chunks.map((chunk) => chunk.text).join("\n\n"),
      source: "pinecone",
    };
  } catch (error) {
    console.warn("Resume retrieval fallback enabled:", error?.message || error);
    return { chunks: [], context: "", source: "vector-retrieval-failed" };
  }
};
