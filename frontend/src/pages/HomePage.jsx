import { Link } from "react-router";
import {
  ArrowRightIcon,
  ScaleIcon,
  SparklesIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";

function HomePage() {
  return (
    <div className="min-h-screen">
      <nav className="ca-nav">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="ca-logo">
            <div className="ca-logo-mark">
              <SparklesIcon className="size-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="ca-logo-text">
                <span>Code</span>
                <span>Arena</span>
              </span>
              <span className="text-xs text-[var(--text-secondary)]">Where Code Meets Competition</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="btn btn-ghost btn-sm" data-ripple>
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn btn-primary btn-sm" data-ripple>
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      <main className="page-wrap">
        <section className="relative overflow-hidden">
          <div className="hero-particles" />
          <div className="max-w-6xl mx-auto px-6 py-24 text-center relative" data-reveal>
            <div className="ai-indicator mx-auto mb-6">
              <span className="ai-pulse" />
              Competitive coding + legal tech
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight">
              Where Code Meets Competition
            </h1>
            <p className="mt-4 text-lg text-[var(--text-secondary)]">
              CodeArena is the premium arena for competitive coding, legal-tech simulations, and
              real-time interview readiness.
            </p>
            <p className="mt-6 text-base text-[var(--text-secondary)] max-w-2xl mx-auto">
              Train against realistic briefs, solve under pressure, and build confidence with
              structured AI feedback.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <SignUpButton mode="modal">
                <button className="btn btn-primary btn-lg" data-ripple>
                  Start Competing
                  <ArrowRightIcon className="size-5" />
                </button>
              </SignUpButton>
              <button className="btn btn-outline btn-lg" data-ripple>
                View Arena Walkthrough
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-6" data-reveal>
          <div className="card">
            <div className="card-body space-y-4">
              <div className="size-12 rounded-2xl border border-[var(--border-subtle)] flex items-center justify-center">
                <TrophyIcon className="size-6" />
              </div>
              <h3 className="text-xl font-semibold">Competitive Arenas</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Join structured competitions with time-boxed prompts and scoreboard-ready
                analytics.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body space-y-4">
              <div className="size-12 rounded-2xl border border-[var(--border-subtle)] flex items-center justify-center">
                <ScaleIcon className="size-6" />
              </div>
              <h3 className="text-xl font-semibold">Legal Tech Workflows</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Practice compliance, contract reviews, and research tasks alongside core coding
                drills.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body space-y-4">
              <div className="size-12 rounded-2xl border border-[var(--border-subtle)] flex items-center justify-center">
                <UsersIcon className="size-6" />
              </div>
              <h3 className="text-xl font-semibold">Live Collaboration</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Invite peers, run mock interviews, and leave with a clear improvement roadmap.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pb-24" data-reveal>
          <div className="card">
            <div className="card-body grid gap-6 md:grid-cols-3 text-center">
              <div>
                <p className="text-3xl font-semibold">10K+</p>
                <p className="text-sm text-[var(--text-secondary)]">Competitive sessions</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">92%</p>
                <p className="text-sm text-[var(--text-secondary)]">Faster readiness</p>
              </div>
              <div>
                <p className="text-3xl font-semibold">24/7</p>
                <p className="text-sm text-[var(--text-secondary)]">AI arena access</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
export default HomePage;
