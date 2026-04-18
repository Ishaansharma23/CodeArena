function AIScrutinySection() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div className="rounded-3xl border border-white/10 bg-[#0b0f14]/80 p-6 backdrop-blur" data-reveal>
          <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-gray-400">
            <span className="h-2 w-2 rounded-full bg-[#00ff88] animate-pulse" />
            Analyzing resume...
          </div>

          <div className="mt-6 flex flex-col gap-4">
            <div className="max-w-[85%] rounded-2xl border border-white/10 bg-[#0a0f16] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#00ff88]">AI</p>
              <p className="mt-2 text-sm text-gray-200">
                Walk me through the system you designed to handle concurrency at scale.
              </p>
            </div>

            <div className="max-w-[85%] self-end rounded-2xl border border-[#00ff88]/30 bg-[#0b0f14] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400">You</p>
              <p className="mt-2 text-sm text-gray-200">
                I introduced a task queue with idempotent workers and a shared cache to avoid
                duplicate execution.
              </p>
            </div>

            <div className="max-w-[85%] rounded-2xl border border-white/10 bg-[#0a0f16] p-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#00ff88]">AI</p>
              <p className="mt-2 text-sm text-gray-200">
                Which tradeoffs did you accept for throughput vs. consistency in that design?
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6" data-reveal>
          <h2 className="text-4xl md:text-5xl font-extrabold uppercase">
            AI{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(90deg,rgba(0,255,136,1),rgba(0,255,136,0.6))]">
              SCRUTINY
            </span>
          </h2>
          <p className="text-lg text-gray-300">
            Our AI deconstructs your resume and evaluates your technical depth in real-time.
          </p>

          <div className="rounded-3xl border border-white/10 border-l-4 border-l-[#00ff88] bg-[#0b0f14]/80 p-6 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">Evaluation</p>
            <p className="mt-3 text-sm text-gray-200">
              Strong systems thinking. Clear articulation of tradeoffs and failure modes. Consider
              deeper metrics around cache invalidation and load shedding.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-[#00ff88]" />
              Depth score: 8.7 / 10
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AIScrutinySection;
