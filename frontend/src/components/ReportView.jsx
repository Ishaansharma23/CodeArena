import { CheckCircleIcon, AlertTriangleIcon, TrendingUpIcon } from "lucide-react";

function ReportView({ report }) {
  if (!report) return null;

  return (
    <div className="card" data-reveal>
      <div className="card-body">
        <h2 className="text-2xl font-black mb-4">Interview Report</h2>

        <div className="ca-stat-grid md:grid-cols-3">
          <div className="ca-stat">
            <p className="ca-stat-title">Technical</p>
            <p className="ca-stat-value">{report.technicalScore ?? 0}/10</p>
          </div>
          <div className="ca-stat">
            <p className="ca-stat-title">DSA</p>
            <p className="ca-stat-value">{report.dsaScore ?? 0}/10</p>
          </div>
          <div className="ca-stat">
            <p className="ca-stat-title">Communication</p>
            <p className="ca-stat-value">{report.communicationScore ?? 0}/10</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="ca-panel-soft p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircleIcon className="size-4 text-[var(--text-secondary)]" />
              <h3 className="font-semibold">Strengths</h3>
            </div>
            <ul className="list-disc list-inside text-sm opacity-80 space-y-1">
              {report.strengths?.length ? report.strengths.map((item) => <li key={item}>{item}</li>) : <li>Not provided</li>}
            </ul>
          </div>

          <div className="ca-panel-soft p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangleIcon className="size-4 text-[var(--text-secondary)]" />
              <h3 className="font-semibold">Weaknesses</h3>
            </div>
            <ul className="list-disc list-inside text-sm opacity-80 space-y-1">
              {report.weaknesses?.length ? report.weaknesses.map((item) => <li key={item}>{item}</li>) : <li>Not provided</li>}
            </ul>
          </div>

          <div className="ca-panel-soft p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUpIcon className="size-4 text-[var(--text-secondary)]" />
              <h3 className="font-semibold">Suggestions</h3>
            </div>
            <ul className="list-disc list-inside text-sm opacity-80 space-y-1">
              {report.suggestions?.length ? report.suggestions.map((item) => <li key={item}>{item}</li>) : <li>Not provided</li>}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-semibold">Verdict</p>
          <p className="opacity-80 mt-1">{report.verdict || "Not provided"}</p>
        </div>
        <div className="mt-4">
          <p className="font-semibold">Summary</p>
          <p className="opacity-80 mt-1">{report.summary || "Not provided"}</p>
        </div>
      </div>
    </div>
  );
}

export default ReportView;
