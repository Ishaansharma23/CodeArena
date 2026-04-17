import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import InterviewHistory from "../components/InterviewHistory";
import { useMyResumes } from "../hooks/useResumes";
import { useStartInterview } from "../hooks/useInterviews";

function InterviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialResumeId = location.state?.resumeId || "";
  const [resumeId, setResumeId] = useState(initialResumeId);
  const { data: resumeData } = useMyResumes();
  const resumes = resumeData?.resumes || [];

  const startMutation = useStartInterview();

  useEffect(() => {
    if (initialResumeId) {
      setResumeId(initialResumeId);
    }
  }, [initialResumeId]);

  const handleStart = () => {
    if (!resumeId) return;
    startMutation.mutate(
      { resumeId },
      {
        onSuccess: (result) => {
          const interviewId = result?.interview?._id;
          const question = result?.question;

          if (!interviewId || !question) {
            toast.error("Interview could not start. Please try again.");
            return;
          }

          navigate(`/live-interview?interviewId=${interviewId}`, {
            state: {
              interviewId,
              initialQuestion: question,
              resumeId,
            },
          });
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to start interview. Please try again.");
        },
      }
    );
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-wrap">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          <div className="card" data-reveal>
            <div className="card-body">
              <h2 className="text-2xl font-black">Start Interview</h2>
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <select
                  className="ca-input w-full md:max-w-lg"
                  value={resumeId}
                  onChange={(event) => setResumeId(event.target.value)}
                >
                  <option value="" disabled>
                    Select resume
                  </option>
                  {resumes.map((resume) => (
                    <option key={resume._id} value={resume._id}>
                      {resume.fileName || "Resume"} ({new Date(resume.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-primary"
                  onClick={handleStart}
                  disabled={!resumeId || startMutation.isPending}
                >
                  {startMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="loading loading-spinner loading-sm"></span>
                      Starting...
                    </span>
                  ) : (
                    "Start"
                  )}
                </button>
              </div>
            </div>
          </div>
          <InterviewHistory />
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;