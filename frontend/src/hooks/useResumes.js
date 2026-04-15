import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { resumeApi } from "../api/resumes";

const requireToken = async (getToken) => {
  const token = await getToken();
  if (!token) {
    throw new Error("Missing auth token");
  }
  return token;
};

export const useUploadResume = () => {
  const { getToken } = useAuth();

  return useMutation({
    mutationKey: ["uploadResume"],
    mutationFn: async (file) => resumeApi.uploadResume(file, await requireToken(getToken)),
    onSuccess: () => toast.success("Resume uploaded successfully"),
    onError: (error) => toast.error(error.response?.data?.message || error.message),
  });
};

export const useMyResumes = () => {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["myResumes"],
    queryFn: async () => resumeApi.getMyResumes(await requireToken(getToken)),
    enabled: isLoaded && isSignedIn,
  });
};
