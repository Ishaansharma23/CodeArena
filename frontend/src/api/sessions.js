import axiosInstance from "../lib/axios";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const ensureSessionPayload = (data) => {
  if (data?.session?._id) return data;

  const message =
    typeof data === "object" && data?.message ? data.message : "Invalid session response";

  throw new Error(message);
};

export const sessionApi = {
  createSession: async (data, token) => {
    const response = await axiosInstance.post("/sessions", data, authConfig(token));
    return ensureSessionPayload(response.data);
  },

  getActiveSessions: async (token) => {
    const response = await axiosInstance.get("/sessions/active", authConfig(token));
    return response.data;
  },
  getMyRecentSessions: async (token) => {
    const response = await axiosInstance.get("/sessions/my-recent", authConfig(token));
    return response.data;
  },

  getSessionById: async (id, token) => {
    const response = await axiosInstance.get(`/sessions/${id}`, authConfig(token));
    return response.data;
  },

  joinSession: async (id, token) => {
    const response = await axiosInstance.post(`/sessions/${id}/join`, null, authConfig(token));
    return response.data;
  },
  endSession: async (id, token) => {
    const response = await axiosInstance.post(`/sessions/${id}/end`, null, authConfig(token));
    return response.data;
  },
  getStreamToken: async (token) => {
    const response = await axiosInstance.get(`/chat/token`, authConfig(token));
    return response.data;
  },
};
