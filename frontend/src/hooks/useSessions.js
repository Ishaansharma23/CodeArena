import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { sessionApi } from "../api/sessions";

const requireToken = async (getToken) => {
  const token = await getToken();
  if (!token) {
    throw new Error("Missing auth token");
  }
  return token;
};

export const useCreateSession = () => {
  const { getToken } = useAuth();
  const result = useMutation({
    mutationKey: ["createSession"],
    mutationFn: async (data) => sessionApi.createSession(data, await requireToken(getToken)),
    onSuccess: () => toast.success("Session created successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message || "Failed to create room"),
  });

  return result;
};

export const useActiveSessions = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const result = useQuery({
    queryKey: ["activeSessions"],
    queryFn: async () => sessionApi.getActiveSessions(await requireToken(getToken)),
    enabled: isLoaded && isSignedIn,
  });

  return result;
};

export const useMyRecentSessions = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const result = useQuery({
    queryKey: ["myRecentSessions"],
    queryFn: async () => sessionApi.getMyRecentSessions(await requireToken(getToken)),
    enabled: isLoaded && isSignedIn,
  });

  return result;
};

export const useSessionById = (id) => {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const result = useQuery({
    queryKey: ["session", id],
    queryFn: async () => sessionApi.getSessionById(id, await requireToken(getToken)),
    enabled: !!id && isLoaded && isSignedIn,
    refetchInterval: 5000, // refetch every 5 seconds to detect session status changes
  });

  return result;
};

export const useJoinSession = () => {
  const { getToken } = useAuth();
  const result = useMutation({
    mutationKey: ["joinSession"],
    mutationFn: async (id) => sessionApi.joinSession(id, await requireToken(getToken)),
    onSuccess: () => toast.success("Joined session successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message || "Failed to join session"),
  });

  return result;
};

export const useEndSession = () => {
  const { getToken } = useAuth();
  const result = useMutation({
    mutationKey: ["endSession"],
    mutationFn: async (id) => sessionApi.endSession(id, await requireToken(getToken)),
    onSuccess: () => toast.success("Session ended successfully!"),
    onError: (error) =>
      toast.error(error.response?.data?.message || error.message || "Failed to end session"),
  });

  return result;
};
