import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { interviewApi } from "../api/interviews";

const requireInterviewToken = async (getToken, isSignedIn) => {
  if (!isSignedIn) {
    throw new Error("Please sign in to continue the interview.");
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const token = await getToken();
      if (token) return token;
    } catch {
      // Retry once when Clerk token fetch is delayed.
    }
  }

  throw new Error("Unable to verify your session. Please refresh and try again.");
};

export const useStartInterview = () => {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationKey: ["startInterview"],
    mutationFn: async (payload) =>
      interviewApi.startInterview(payload, await requireInterviewToken(getToken, isSignedIn)),
    onError: (error) => toast.error(error.response?.data?.message || error.message),
  });
};

export const useSubmitAnswer = () => {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationKey: ["submitAnswer"],
    mutationFn: async ({ id, payload }) =>
      interviewApi.submitAnswer(id, payload, await requireInterviewToken(getToken, isSignedIn)),
    onError: (error) => toast.error(error.response?.data?.message || error.message),
  });
};

export const useEndInterview = () => {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationKey: ["endInterview"],
    mutationFn: async (id) =>
      interviewApi.endInterview(id, await requireInterviewToken(getToken, isSignedIn)),
    onError: (error) => toast.error(error.response?.data?.message || error.message),
  });
};

export const useInterviewById = (id) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["interview", id],
    queryFn: async () =>
      interviewApi.getInterviewById(id, await requireInterviewToken(getToken, isSignedIn)),
    enabled: !!id && isLoaded && isSignedIn,
  });
};

export const useInterviewReport = (id) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["interviewReport", id],
    queryFn: async () =>
      interviewApi.getReport(id, await requireInterviewToken(getToken, isSignedIn)),
    enabled: !!id && isLoaded && isSignedIn,
  });
};

export const useInterviewHistory = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["interviewHistory"],
    queryFn: async () => interviewApi.getHistory(await requireInterviewToken(getToken, isSignedIn)),
    enabled: isLoaded && isSignedIn,
  });
};

export const useDeleteInterview = () => {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationKey: ["deleteInterview"],
    mutationFn: async (id) =>
      interviewApi.deleteInterview(id, await requireInterviewToken(getToken, isSignedIn)),
    onError: (error) => toast.error(error.response?.data?.message || error.message),
  });
};

export const useClearInterviewHistory = () => {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationKey: ["clearInterviewHistory"],
    mutationFn: async () =>
      interviewApi.clearHistory(await requireInterviewToken(getToken, isSignedIn)),
    onError: (error) => toast.error(error.response?.data?.message || error.message),
  });
};
