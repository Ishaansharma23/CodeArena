import { getDifficultyBadgeClass } from "../lib/utils";
function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems }) {
  return (
    <div className="h-full overflow-y-auto ca-panel">
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{problem.title}</h1>
          <span className={getDifficultyBadgeClass(problem.difficulty)}>
            {problem.difficulty}
          </span>
        </div>
        <p className="text-[var(--text-secondary)]">{problem.category}</p>

        {/* Problem selector */}
        <div className="mt-4">
          <select
            className="ca-input w-full"
            value={currentProblemId}
            onChange={(e) => onProblemChange(e.target.value)}
          >
            {allProblems.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} - {p.difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* PROBLEM DESC */}
        <div className="ca-panel-soft p-5">
          <h2 className="text-xl font-bold text-[var(--text-primary)]">Description</h2>

          <div className="space-y-3 text-base leading-relaxed">
            <p className="text-[var(--text-secondary)]">{problem.description.text}</p>
            {problem.description.notes.map((note, idx) => (
              <p key={idx} className="text-[var(--text-secondary)]">
                {note}
              </p>
            ))}
          </div>
        </div>

        {/* EXAMPLES SECTION */}
        <div className="ca-panel-soft p-5">
          <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Examples</h2>
          <div className="space-y-4">
            {problem.examples.map((example, idx) => (
              <div key={idx}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="ca-chip">{idx + 1}</span>
                  <p className="font-semibold text-[var(--text-primary)]">Example {idx + 1}</p>
                </div>
                <div className="ca-panel p-4 font-mono text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-white/70 font-bold min-w-[70px]">Input:</span>
                    <span>{example.input}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-white/70 font-bold min-w-[70px]">Output:</span>
                    <span>{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div className="pt-2 border-t border-white/10 mt-2">
                      <span className="text-[var(--text-secondary)] font-sans text-xs">
                        <span className="font-semibold">Explanation:</span> {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONSTRAINTS */}
        <div className="ca-panel-soft p-5">
          <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Constraints</h2>
          <ul className="space-y-2 text-[var(--text-secondary)]">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="text-[var(--text-secondary)]">•</span>
                <code className="text-sm">{constraint}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ProblemDescription;
