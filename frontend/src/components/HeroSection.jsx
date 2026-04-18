import { ArrowRightIcon, CheckCircle2Icon } from "lucide-react";
import { SignUpButton } from "@clerk/clerk-react";

const FEATURES = [
  "Real-time conflict resolution",
  "Integrated video comms",
  "Multi-language runtime arena",
];

function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 right-[-10%] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-0 left-[-6%] h-72 w-72 rounded-full bg-white/5 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
        <div className="space-y-8" data-reveal>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Low latency arena</p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight uppercase">
            SYNCHRONIZED <span className="text-white">COMBAT</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Experience low-latency collaborative coding. Solve complex DSA problems with peers in
            real-time with voice + video.
          </p>
          <div className="space-y-3">
            {FEATURES.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2Icon className="h-5 w-5 text-white/80" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <SignUpButton mode="modal">
            <button className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-[0_0_22px_rgba(255,255,255,0.25)] transition hover:translate-y-[-1px] hover:shadow-[0_0_30px_rgba(255,255,255,0.35)]">
              Start Competing
              <ArrowRightIcon className="h-4 w-4" />
            </button>
          </SignUpButton>
        </div>

        <div className="relative" data-reveal>
          <div className="home-float rounded-[32px] border border-white/10 bg-[#0b0f14]/80 p-4 shadow-[0_0_60px_rgba(0,0,0,0.6)]">
            <div className="relative overflow-hidden rounded-[24px] border border-white/10">
              <img
                src="/hero.png"
                alt="Developer coding"
                className="h-full w-full object-cover contrast-110 brightness-90"
              />
              <div className="absolute inset-0 bg-[#00ff88]/20 mix-blend-screen" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_100%)]" />
            </div>
          </div>

          <div className="absolute -bottom-6 left-8 rounded-2xl border border-white/10 bg-[#0b0f14]/90 px-4 py-3 text-xs text-gray-300 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Latency</p>
            <p className="text-sm font-semibold text-white">28ms sync</p>
          </div>

          <div className="absolute -top-6 right-10 rounded-2xl border border-white/10 bg-[#0b0f14]/90 px-4 py-3 text-xs text-gray-300 backdrop-blur">
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Room</p>
            <p className="text-sm font-semibold text-white">Locked 2/2</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
