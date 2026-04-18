import { CheckCircle2Icon } from "lucide-react";

const POINTS = [
  "Sub-30ms cursor synchronization",
  "Shared runtime with deterministic merges",
  "Voice and video in the same arena",
];

const CODE_LINES = [
  {
    key: "l1",
    content: (
      <>
        <span className="text-white">function</span> syncArena(peers) {"{"}
      </>
    ),
  },
  {
    key: "l2",
    content: (
      <>
        {"  "}
        <span className="text-white">const</span> payload = {"{"}
      </>
    ),
  },
  {
    key: "l3",
    content: <>{"    "}revision: peers.active.rev,</>,
  },
  {
    key: "l4",
    content: <>{"    "}cursor: peers.active.cursor,</>,
  },
  {
    key: "l5",
    content: <>{"    "}delta: peers.buffer.flush(),</>,
  },
  {
    key: "l6",
    content: <>{"  "}{"}"};</>,
  },
  {
    key: "l7",
    content: (
      <>
        {"  "}
        <span className="text-white">return</span> arena.push(payload);
      </>
    ),
  },
  {
    key: "l8",
    content: <>{"}"}</>,
  },
];

function SyncCombatSection() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6" data-reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase text-white">
            REAL-TIME COLLABORATION
          </h2>
          <p className="text-lg text-gray-300">
            Every keystroke, cursor, and runtime result stays in lockstep. Build together with
            precision-grade latency and zero context loss.
          </p>
          <div className="space-y-3">
            {POINTS.map((point) => (
              <div key={point} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2Icon className="h-5 w-5 text-white/80" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-[#0b0f14]/80 p-5 backdrop-blur" data-reveal>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
              <span className="h-2 w-2 rounded-full bg-white/20" />
            </div>
            <span className="font-mono">arena-core.js</span>
          </div>

          <div className="mt-4">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f16] p-4">
              <div className="absolute left-12 right-4 top-[96px] h-6 rounded-md bg-white/10 border-l-2 border-white/50" />
              <div className="absolute left-[198px] top-[100px] h-5 w-[2px] bg-white/70 home-cursor" />

              <div className="relative font-mono text-sm leading-6 text-gray-300">
                {CODE_LINES.map((line, index) => (
                  <div key={line.key} className="flex items-start gap-4">
                    <span className="w-6 text-right text-gray-500">{index + 1}</span>
                    <span>{line.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SyncCombatSection;
