import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ENV } from "./env.js";

let embeddingsClient = null;

export const isEmbeddingsConfigured = () => Boolean(ENV.GEMINI_API_KEY);

const getEmbeddingModel = () => "text-embedding-004";

export const getEmbeddingsClient = () => {
  if (!isEmbeddingsConfigured()) return null;

  if (!embeddingsClient) {
    embeddingsClient = new GoogleGenerativeAIEmbeddings({
      apiKey: ENV.GEMINI_API_KEY,
      model: getEmbeddingModel(),
    });
  }

  return embeddingsClient;
};
