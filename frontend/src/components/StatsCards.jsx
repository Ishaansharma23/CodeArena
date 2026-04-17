import { TrophyIcon, UsersIcon } from "lucide-react";

function StatsCards({ activeSessionsCount, recentSessionsCount }) {
  return (
    <div className="lg:col-span-1 grid grid-cols-1 gap-6" data-reveal>
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 border border-[var(--border-subtle)] rounded-2xl">
              <UsersIcon className="w-7 h-7" />
            </div>
            <div className="ca-badge">Live</div>
          </div>
          <div className="text-4xl font-semibold mb-1">{activeSessionsCount}</div>
          <div className="text-sm text-[var(--text-secondary)]">Active Sessions</div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 border border-[var(--border-subtle)] rounded-2xl">
              <TrophyIcon className="w-7 h-7" />
            </div>
          </div>
          <div className="text-4xl font-semibold mb-1">{recentSessionsCount}</div>
          <div className="text-sm text-[var(--text-secondary)]">Total Sessions</div>
        </div>
      </div>
    </div>
  );
}

export default StatsCards;
