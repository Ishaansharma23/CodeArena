import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import ResumeUpload from "../components/ResumeUpload";
import { useMyResumes, useUploadResume } from "../hooks/useResumes";

function UploadResumePage() {
  const navigate = useNavigate();
  const [selectedResume, setSelectedResume] = useState(null);

  const uploadMutation = useUploadResume();
  const { data, isLoading } = useMyResumes();

  const resumes = data?.resumes || [];

  const handleUpload = (file) => {
    uploadMutation.mutate(file, {
      onSuccess: (result) => {
        setSelectedResume(result.resume);
      },
    });
  };

  const handleStartInterview = () => {
    if (!selectedResume) return;
    navigate("/interview", { state: { resumeId: selectedResume._id } });
  };

  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <ResumeUpload
          onUpload={handleUpload}
          isUploading={uploadMutation.isPending}
          resume={selectedResume}
        />

        <div className="card bg-base-100 border-2 border-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">Your Resumes</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleStartInterview}
                disabled={!selectedResume}
              >
                Start Interview
              </button>
            </div>

            {isLoading ? (
              <p className="opacity-70">Loading resumes...</p>
            ) : resumes.length === 0 ? (
              <p className="opacity-70">No resumes uploaded yet.</p>
            ) : (
              <div className="mt-4 space-y-2">
                {resumes.map((resume) => (
                  <button
                    key={resume._id}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      selectedResume?._id === resume._id
                        ? "border-primary bg-primary/10"
                        : "border-base-300 hover:border-primary/40"
                    }`}
                    onClick={() => setSelectedResume(resume)}
                  >
                    <p className="font-semibold">{resume.fileName || "Resume"}</p>
                    <p className="text-xs opacity-60">{new Date(resume.createdAt).toLocaleString()}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadResumePage;
