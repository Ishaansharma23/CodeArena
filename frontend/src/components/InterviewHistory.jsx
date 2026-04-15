import { ClipboardListIcon, FileTextIcon, Loader2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import { useInterviewHistory } from "../hooks/useInterviews";

const formatScore = (value) => (typeof value === "number" ? `${value}/10` : "-/-");

function InterviewHistory() {
  const navigate = useNavigate();
  const { data, isLoading } = useInterviewHistory();
  const interviews = data?.interviews || [];

  return (
    <div className="card bg-base-100 border-2 border-secondary/20 hover:border-secondary/30">
      <div className="card-body">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-secondary to-primary rounded-xl">
            <ClipboardListIcon className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-2xl font-black">Interview History</h2>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2Icon className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : interviews.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map((interview) => (
              <div key={interview._id} className="card bg-base-200 border border-base-300">
                <div className="card-body p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-lg">Interview Summary</h3>
                      <p className="text-sm opacity-70">
                        {interview.endedAt
                          ? formatDistanceToNow(new Date(interview.endedAt), { addSuffix: true })
                          : "Completed"}
                      </p>
                    </div>
                    <span className="badge badge-success">Completed</span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs opacity-80">
                    <span className="badge badge-outline">Questions: {interview.questionCount ?? 0}</span>
                    <span className="badge badge-outline">Technical {formatScore(interview.report?.technicalScore)}</span>
                    <span className="badge badge-outline">DSA {formatScore(interview.report?.dsaScore)}</span>
                    <span className="badge badge-outline">Comms {formatScore(interview.report?.communicationScore)}</span>
                  </div>

                  <div className="bg-base-100 rounded-xl p-3 text-sm opacity-80">
                    {interview.report?.summary || "Report summary not available."}
                  </div>

                  <div className="flex items-center justify-between text-xs opacity-60">
                    <div className="flex items-center gap-2">
                      <FileTextIcon className="w-4 h-4" />
                      <span>{interview.resume?.fileName || "Resume"}</span>
                    </div>
                    <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                  </div>

                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate(`/report/${interview._id}`)}
                  >
                    View Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg font-semibold opacity-70">No interviews yet</p>
            <p className="text-sm opacity-50">Start an interview to see your history here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;
