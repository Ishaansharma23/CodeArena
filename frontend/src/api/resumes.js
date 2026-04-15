import axiosInstance from "../lib/axios";

const authConfig = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const resumeApi = {
  uploadResume: async (file, token) => {
    const formData = new FormData();
    formData.append("resume", file);

    const response = await axiosInstance.post("/resumes/upload", formData, {
      ...authConfig(token),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  getMyResumes: async (token) => {
    const response = await axiosInstance.get("/resumes/mine", authConfig(token));
    return response.data;
  },

  getResumeById: async (id, token) => {
    const response = await axiosInstance.get(`/resumes/${id}`, authConfig(token));
    return response.data;
  },
};
