import { CheckCircle2Icon } from "lucide-react";

const POINTS = [
  "Resume parsing with deep skill extraction",
  "AI-generated technical interview questions",
  "Real-time evaluation & feedback",
  "Communication & stress analysis",
];

const CHAT = [
  { role: "AI", text: "Explain time complexity of binary search." },
  { role: "YOU", text: "It is O(log n) because search space halves each step." },
  { role: "AI", text: "Correct. Can you optimize further for edge cases?" },
];

function AIInterviewSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#05070a] to-[#0b1220]">

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-6">

          <h2 className="text-4xl md:text-5xl font-extrabold">
            AI Interview Engine
          </h2>

          <p className="text-lg text-gray-400">
            Upload your resume and let AI simulate real-world technical interviews.
            Get evaluated on problem-solving, communication, and thinking ability.
          </p>

          {/* POINTS */}
          <div className="space-y-3">
            {POINTS.map((point) => (
              <div key={point} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2Icon className="h-5 w-5 text-blue-400" />
                <span>{point}</span>
              </div>
            ))}
          </div>

          {/* CHAT UI */}
          <div className="mt-6 rounded-xl border border-white/10 bg-[#0b0f14] p-4 space-y-3">
            {CHAT.map((msg, i) => (
              <div key={i}>
                <p className={`text-xs mb-1 ${msg.role === "AI" ? "text-blue-400" : "text-green-400"}`}>
                  {msg.role}:
                </p>
                <p className="text-sm text-white/90">{msg.text}</p>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT SIDE (CODE UI STYLE SAME) */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">

          {/* HEADER */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex gap-2">
              <span className="h-2 w-2 rounded-full bg-red-400/70" />
              <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
              <span className="h-2 w-2 rounded-full bg-green-400/70" />
            </div>
            <span className="font-mono">Lets Code!</span>
          </div>

          {/* CODE BOX */}
          <div className="mt-4 rounded-2xl border border-blue-400/30 bg-[#0f172a] p-4 relative">

            {/* Cursor */}
            <div className="absolute left-[185px] top-[17px] h-5 w-[2px] bg-blue-400 animate-pulse" />

            <pre className="text-sm text-gray-200 font-mono leading-6">
{`function startInterview(candidate) {
  const resume = parse(candidate.resume);

  const questions = AI.generate({
    skills: resume.skills,
    difficulty: "adaptive"
  });

  return interview.begin({
    questions,
    realtimeFeedback: true
  });
}`}
            </pre>

          </div>
        </div>
      </div>
    </section>
  );
}

export default AIInterviewSection;