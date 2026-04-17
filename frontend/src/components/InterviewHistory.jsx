import { ClipboardListIcon, FileTextIcon, Loader2Icon, Trash2Icon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";
import { useInterviewHistory } from "../hooks/useInterviews";
import { useState } from "react";

const formatScore = (value) => (typeof value === "number" ? `${value}/10` : "-/-");

function InterviewHistory() {
  const navigate = useNavigate();
  const { data, isLoading } = useInterviewHistory();
  const interviews = data?.interviews || [];
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [removingIds, setRemovingIds] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [showClearAll, setShowClearAll] = useState(false);
  const visibleInterviews = interviews.filter((interview) => !removedIds.includes(interview._id));

  const handleLocalDelete = (id) => {
    setRemovingIds((prev) => [...prev, id]);
    setPendingDeleteId(null);
    setTimeout(() => {
      setRemovedIds((prev) => [...prev, id]);
      setRemovingIds((prev) => prev.filter((item) => item !== id));
    }, 320);
  };

  return (
    <div className="card" data-reveal>
      <div className="card-body">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 border border-[var(--border-subtle)] rounded-xl">
            <ClipboardListIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 flex items-center justify-between">
            <h2 className="text-2xl font-black">Interview History</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowClearAll(true)}
              disabled={!visibleInterviews.length}
            >
              Clear All History
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2Icon className="w-10 h-10 animate-spin text-white/70" />
          </div>
        ) : visibleInterviews.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleInterviews.map((interview, index) => (
                <div
                  key={interview._id}
                  className={`ca-panel transition-all duration-300 ${
                    removingIds.includes(interview._id)
                      ? "opacity-0 translate-y-2 scale-[0.98]"
                      : "opacity-100"
                  }`}
                  data-reveal
                  style={{ transitionDelay: `${index * 0.04}s` }}
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-lg">Interview Summary</h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {interview.endedAt
                            ? formatDistanceToNow(new Date(interview.endedAt), { addSuffix: true })
                            : "Completed"}
                        </p>
                      </div>
                      <button
                        className="btn btn-ghost btn-xs"
                        onClick={() =>
                          setPendingDeleteId((prev) => (prev === interview._id ? null : interview._id))
                        }
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="ca-chip">Questions: {interview.questionCount ?? 0}</span>
                      <span className="ca-chip">Technical {formatScore(interview.report?.technicalScore)}</span>
                      <span className="ca-chip">DSA {formatScore(interview.report?.dsaScore)}</span>
                      <span className="ca-chip">Comms {formatScore(interview.report?.communicationScore)}</span>
                    </div>

                    <div className="ca-panel-soft p-3 text-sm text-[var(--text-secondary)]">
                      {interview.report?.summary || "Report summary not available."}
                    </div>

                    {pendingDeleteId === interview._id && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">Delete this entry?</span>
                        <div className="flex items-center gap-2">
                          <button className="btn btn-ghost btn-xs" onClick={() => setPendingDeleteId(null)}>
                            Cancel
                          </button>
                          <button className="btn btn-primary btn-xs" onClick={() => handleLocalDelete(interview._id)}>
                            Confirm
                          </button>
                        </div>
                      </div>
                    )}

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

      {showClearAll && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Clear interview history?</h3>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              This removes all interview cards from this view. (Backend deletion is not wired yet.)
            </p>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setShowClearAll(false)}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const allIds = interviews.map((item) => item._id);
                  setRemovingIds(allIds);
                  setTimeout(() => {
                    setRemovedIds(allIds);
                    setRemovingIds([]);
                  }, 320);
                  setShowClearAll(false);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InterviewHistory;
