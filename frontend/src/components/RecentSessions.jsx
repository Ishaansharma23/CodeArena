import { Code2, Clock, Users, Trophy, Loader } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentSessions({ sessions, isLoading }) {
  return (
    <div className="card mt-8" data-reveal>
      <div className="card-body">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 border border-[var(--border-subtle)] rounded-xl">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-black">Your Past Sessions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <Loader className="w-10 h-10 animate-spin text-white/70" />
            </div>
          ) : sessions.length > 0 ? (
            sessions.map((session, index) => {
              const participantCount = (session.participants?.length || 0) + 1;

              return (
              <div
                key={session._id}
                className={`relative ca-panel transition-colors ${
                  session.status === "active"
                    ? "border-[var(--border-hover)]"
                    : "hover:border-[var(--border-hover)]"
                }`}
                data-reveal
                style={{ transitionDelay: `${index * 0.04}s` }}
              >
                {session.status === "active" && (
                  <div className="absolute top-3 right-3">
                    <div className="ca-chip">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--text-secondary)] animate-pulse" />
                      ACTIVE
                    </div>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center">
                      <Code2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base mb-1 truncate">{session.problem}</h3>
                      <span className={`${getDifficultyBadgeClass(session.difficulty)} text-xs`}>
                        {session.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm opacity-80 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(session.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {participantCount} participant
                        {participantCount > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    <span className="text-xs font-semibold opacity-80 uppercase">Completed</span>
                    <span className="text-xs opacity-40">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 border border-[var(--border-subtle)] rounded-3xl flex items-center justify-center">
                <Trophy className="w-10 h-10 text-white/50" />
              </div>
              <p className="text-lg font-semibold opacity-70 mb-1">No sessions yet</p>
              <p className="text-sm opacity-50">Start your coding journey today!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RecentSessions;
