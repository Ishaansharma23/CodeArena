import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="page-wrap">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
            <p className="text-base-content/70">
              Sharpen your coding skills with these curated problems
            </p>
          </div>

          <div className="space-y-4">
            {problems.map((problem, index) => (
              <Link
                key={problem.id}
                to={`/problem/${problem.id}`}
                className="card hover:scale-[1.01] transition-transform"
                data-reveal
                style={{ transitionDelay: `${index * 0.04}s` }}
              >
                <div className="card-body">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="size-12 rounded-lg border border-[var(--border-subtle)] flex items-center justify-center">
                          <Code2Icon className="size-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-xl font-bold">{problem.title}</h2>
                            <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-base-content/60"> {problem.category}</p>
                        </div>
                      </div>
                      <p className="text-base-content/80 mb-3">{problem.description.text}</p>
                    </div>

                    <div className="flex items-center gap-2 text-white/70">
                      <span className="font-medium">Open</span>
                      <ChevronRightIcon className="size-5" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 card" data-reveal>
            <div className="card-body">
              <div className="stats stats-vertical lg:stats-horizontal">
                <div className="stat">
                  <div className="stat-title">Total Problems</div>
                  <div className="stat-value text-white">{problems.length}</div>
                </div>

                <div className="stat">
                  <div className="stat-title">Easy</div>
                  <div className="stat-value text-white/80">{easyProblemsCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Medium</div>
                  <div className="stat-value text-white/80">{mediumProblemsCount}</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Hard</div>
                  <div className="stat-value text-white/80">{hardProblemsCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
