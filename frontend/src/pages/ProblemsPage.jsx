import { Link } from "react-router";
import Navbar from "../components/Navbar";

import { PROBLEMS as PROBLEMS_DATA } from "../data/problems";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS_DATA || {});

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
            <p className="text-[var(--text-secondary)]">
              Sharpen your coding skills with these curated problems
            </p>
          </div>

          {problems.length === 0 ? (
            <div className="ca-panel p-8 text-center" data-reveal>
              <p className="text-lg font-semibold">No problems found</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Please check your problem data source.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {problems.map((problem, index) => (
                  <Link
                    key={problem.id}
                    to={`/problem/${problem.id}`}
                    className="card hover:scale-[1.01] transition-transform"
                    data-reveal
                    style={{ transitionDelay: `${index * 0.01}s` }}
                  >
                    <div className="card-body">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="size-12 rounded-lg border border-[var(--border-subtle)] flex items-center justify-center">
                              <Code2Icon className="size-6 text-[var(--text-primary)]" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                  {problem.title}
                                </h2>
                                <span className={getDifficultyBadgeClass(problem.difficulty)}>
                                  {problem.difficulty}
                                </span>
                              </div>
                              <p className="text-sm text-[var(--text-secondary)]">
                                {problem.category}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)]">
                            {problem.description.text}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
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
                  <div className="ca-stat-grid md:grid-cols-4">
                    <div className="ca-stat">
                      <p className="ca-stat-title">Total Problems</p>
                      <p className="ca-stat-value">{problems.length}</p>
                    </div>
                    <div className="ca-stat">
                      <p className="ca-stat-title">Easy</p>
                      <p className="ca-stat-value">{easyProblemsCount}</p>
                    </div>
                    <div className="ca-stat">
                      <p className="ca-stat-title">Medium</p>
                      <p className="ca-stat-value">{mediumProblemsCount}</p>
                    </div>
                    <div className="ca-stat">
                      <p className="ca-stat-title">Hard</p>
                      <p className="ca-stat-value">{hardProblemsCount}</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
