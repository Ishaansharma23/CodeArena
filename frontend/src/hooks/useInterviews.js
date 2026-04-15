import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { interviewApi } from "../api/interviews";

const getTokenWithTimeout = async (getToken, isSignedIn, timeoutMs = 1500) => {
  if (!isSignedIn) return null;

  const timeout = new Promise((resolve) => setTimeout(() => resolve(null), timeoutMs));

  try {
    const token = await Promise.race([getToken(), timeout]);
    return token || null;
  } catch {
    return null;
  }
};

export const useStartInterview = () => {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationKey: ["startInterview"],
    mutationFn: async (payload) =>
      interviewApi.startInterview(payload, await getTokenWithTimeout(getToken, isSignedIn)),
    onError: (error) => toast.error(error.response?.data?.message || error.message),
  });
};

export const useSubmitAnswer = () => {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationKey: ["submitAnswer"],
    mutationFn: async ({ id, payload }) =>
      interviewApi.submitAnswer(id, payload, await getTokenWithTimeout(getToken, isSignedIn)),
    onError: (error) => toast.error(error.response?.data?.message || error.message),
  });
};

export const useEndInterview = () => {
  const { getToken, isSignedIn } = useAuth();

  return useMutation({
    mutationKey: ["endInterview"],
    mutationFn: async (id) =>
      interviewApi.endInterview(id, await getTokenWithTimeout(getToken, isSignedIn)),
    onError: (error) => toast.error(error.response?.data?.message || error.message),
  });
};

export const useInterviewById = (id) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["interview", id],
    queryFn: async () =>
      interviewApi.getInterviewById(id, await getTokenWithTimeout(getToken, isSignedIn)),
    enabled: !!id && isLoaded && isSignedIn,
  });
};

export const useInterviewReport = (id) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["interviewReport", id],
    queryFn: async () =>
      interviewApi.getReport(id, await getTokenWithTimeout(getToken, isSignedIn)),
    enabled: !!id && isLoaded && isSignedIn,
  });
};

export const useInterviewHistory = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["interviewHistory"],
    queryFn: async () => interviewApi.getHistory(await getTokenWithTimeout(getToken, isSignedIn)),
    enabled: isLoaded && isSignedIn,
  });
};
