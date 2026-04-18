import { ArrowRightIcon, CheckCircle2Icon, PlayCircleIcon } from "lucide-react";
import { SignUpButton, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const FEATURES = [
  "Real-time collaborative coding with friends",
  "AI-powered mock interviews from your resume",
  "Multi-language DSA problem solving",
  "Live video + chat during coding sessions",
];

function HeroSection() {
  const { isSignedIn } = useUser();

  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement("span");

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
    circle.classList.add("ripple");

    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  const handleAIInterview = (e) => {
    createRipple(e);

    if (!isSignedIn) {
      toast.error("Login / Sign up first to start AI Interview 🚀");
      return;
    }

    window.location.href = "/interview";
  };

  return (
    <section className="relative overflow-hidden">

      {/* Glow BG */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-28 right-[-10%] h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-[-6%] h-72 w-72 rounded-full bg-purple-400/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-28 grid lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div className="space-y-8">

          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">
            Next-gen coding arena
          </p>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-300 to-purple-400">
              Code. Compete. Get Hired.
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-[520px]">
            Solve DSA problems with friends, simulate real interviews with AI,
            and build real-world coding skills with live collaboration.
          </p>

          {/* FEATURES */}
          <div className="space-y-3">
            {FEATURES.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2Icon className="h-5 w-5 text-blue-400" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 flex-wrap">

            <SignUpButton mode="modal">
              <button
                onClick={createRipple}
                className="relative overflow-hidden rounded-full bg-white px-7 py-3 text-sm font-semibold text-black shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-[1.06] transition"
              >
                Start Competing
              </button>
            </SignUpButton>

            <button
              onClick={handleAIInterview}
              className="relative overflow-hidden rounded-full border border-white/20 px-7 py-3 text-sm text-white hover:scale-[1.06] transition"
            >
              <PlayCircleIcon className="h-4 w-4 inline mr-2" />
              Try AI Interview
            </button>

          </div>
        </div>

        {/* RIGHT (UNCHANGED IMAGE) */}
        <div className="relative">

          <div className="home-float rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl shadow-[0_0_80px_rgba(255,255,255,0.08)]">

            <div className="overflow-hidden rounded-[22px] border border-white/10">
              <img
                src="/hero.png"
                alt="Developer coding"
                className="w-full h-full object-cover"
              />
            </div>

          </div>

        </div>
      </div>

      {/* RIPPLE */}
      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.4);
          transform: scale(0);
          animation: ripple 600ms linear;
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
}

export default HeroSection;