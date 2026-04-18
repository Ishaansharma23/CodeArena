import { Link } from "react-router";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { SparklesIcon } from "lucide-react";
import HeroSection from "../components/HeroSection";
import SyncCombatSection from "../components/SyncCombatSection";

function HomePage() {
  return (
    <div className="min-h-screen text-white bg-[linear-gradient(180deg,#05070a_0%,#0b1220_100%)]">
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
              <span className="text-xs text-gray-400">Where Code Meets Competition</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <SignInButton mode="modal">
              <button className="rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gray-300 transition hover:border-white/40 hover:text-white">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_18px_rgba(255,255,255,0.25)] transition hover:translate-y-[-1px] hover:shadow-[0_0_26px_rgba(255,255,255,0.35)]">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      <main className="pt-10">
        <HeroSection />
        <SyncCombatSection />
      </main>

      <style>{`
        .home-float {
          animation: home-float 8s ease-in-out infinite;
        }

        .home-cursor {
          animation: home-cursor 1s steps(1) infinite;
        }

        .home-active {
          animation: home-active 2.2s ease-in-out infinite;
        }

        @keyframes home-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes home-cursor {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        @keyframes home-active {
          0%, 100% { box-shadow: 0 0 0 rgba(56, 189, 248, 0.25); }
          50% { box-shadow: 0 0 30px rgba(56, 189, 248, 0.45); }
        }

      `}</style>
    </div>
  );
}
export default HomePage;
