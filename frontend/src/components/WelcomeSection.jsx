import { useUser } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";

function WelcomeSection({ onCreateSession }) {
  const { user } = useUser();

  return (
    <div className="relative overflow-hidden" data-reveal>
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="card">
          <div className="card-body flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl border border-[var(--border-subtle)] flex items-center justify-center">
                  <SparklesIcon className="w-6 h-6" />
                </div>
                <p className="text-xs uppercase tracking-[0.36em] text-[var(--text-secondary)]">
                  Arena briefing
                </p>
              </div>
              <h1 className="text-4xl font-semibold">
                Welcome back, {user?.firstName || "there"}.
              </h1>
              <p className="text-base text-[var(--text-secondary)]">
                Ready to level up your coding skills with competitive drills?
              </p>
            </div>
            <button onClick={onCreateSession} className="btn btn-primary btn-lg" data-ripple>
              Create Session
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeSection;
