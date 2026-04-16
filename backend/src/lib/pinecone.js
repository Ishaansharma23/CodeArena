import { Pinecone } from "@pinecone-database/pinecone";
import { ENV } from "./env.js";

let pineconeClient = null;

export const isPineconeConfigured = () => Boolean(ENV.PINECONE_API_KEY && ENV.PINECONE_INDEX_NAME);

export const getPineconeClient = () => {
  if (!isPineconeConfigured()) return null;

  if (!pineconeClient) {
    pineconeClient = new Pinecone({ apiKey: ENV.PINECONE_API_KEY });
  }

  return pineconeClient;
};

export const getPineconeIndex = async () => {
  const client = getPineconeClient();
  if (!client) return null;

  return client.index(ENV.PINECONE_INDEX_NAME);
};

export const buildResumeNamespace = (resumeId) => {
  const prefix = ENV.PINECONE_NAMESPACE_PREFIX || "resume";
  return `${prefix}-${resumeId}`;
};
