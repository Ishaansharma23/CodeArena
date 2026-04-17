import { useParams } from "react-router";
import Navbar from "../components/Navbar";
import ReportView from "../components/ReportView";
import { useInterviewById, useInterviewReport } from "../hooks/useInterviews";

const formatDuration = (start, end) => {
  if (!start || !end) return "-";
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms) || ms <= 0) return "-";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

function ReportPage() {
  const { id } = useParams();
  const { data: reportData, isLoading: loadingReport } = useInterviewReport(id);
  const { data: interviewData, isLoading: loadingInterview } = useInterviewById(id);

  const interview = interviewData?.interview;
  const report = reportData?.report;
  const isLoading = loadingReport || loadingInterview;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-wrap">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {isLoading ? (
            <div className="card" data-reveal>
              <div className="card-body">Loading report...</div>
            </div>
          ) : (
            <>
              <div className="card" data-reveal>
                <div className="card-body">
                  <h2 className="text-2xl font-black mb-4">Interview Overview</h2>
                  <div className="ca-stat-grid md:grid-cols-3">
                    <div className="ca-stat">
                      <p className="ca-stat-title">Status</p>
                      <p className="ca-stat-value">{interview?.status || "-"}</p>
                    </div>
                    <div className="ca-stat">
                      <p className="ca-stat-title">Questions</p>
                      <p className="ca-stat-value">
                        {interview?.questions?.length ?? 0}
                      </p>
                    </div>
                    <div className="ca-stat">
                      <p className="ca-stat-title">Duration</p>
                      <p className="ca-stat-value">
                        {formatDuration(interview?.startedAt, interview?.endedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm opacity-80">
                    <div>
                      <p className="font-semibold">Resume</p>
                      <p>{interview?.resume?.fileName || "Resume"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Completed At</p>
                      <p>
                        {interview?.endedAt
                          ? new Date(interview.endedAt).toLocaleString()
                          : "Not completed"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <ReportView report={report} />

              {interview?.history?.length ? (
                <div className="card" data-reveal>
                  <div className="card-body">
                    <h2 className="text-2xl font-black mb-4">Interview Transcript</h2>
                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                      {interview.history.map((message, index) => (
                        <div
                          key={`${message.role}-${index}`}
                          className={`rounded-xl p-3 text-sm border ${
                            message.role === "assistant"
                              ? "ca-panel-soft border-white/10"
                              : "ca-panel border-white/10"
                          }`}
                        >
                          <p className="text-xs uppercase opacity-70 mb-1">
                            {message.role === "assistant" ? "Interviewer" : "You"}
                          </p>
                          <p>{message.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportPage;
