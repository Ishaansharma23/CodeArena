import axiosInstance from "../lib/axios";

const authConfig = (token) =>
  token
    ? {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    : {};

export const interviewApi = {
  startInterview: async (payload, token) => {
    const response = await axiosInstance.post("/interviews/start", payload, authConfig(token));
    return response.data;
  },

  submitAnswer: async (id, payload, token) => {
    const response = await axiosInstance.post(`/interviews/${id}/answer`, payload, authConfig(token));
    return response.data;
  },

  endInterview: async (id, token) => {
    const response = await axiosInstance.post(`/interviews/${id}/end`, null, authConfig(token));
    return response.data;
  },

  getInterviewById: async (id, token) => {
    const response = await axiosInstance.get(`/interviews/${id}`, authConfig(token));
    return response.data;
  },

  getReport: async (id, token) => {
    const response = await axiosInstance.get(`/interviews/${id}/report`, authConfig(token));
    return response.data;
  },

  getHistory: async (token) => {
    const response = await axiosInstance.get("/interviews/history", authConfig(token));
    return response.data;
  },
};
