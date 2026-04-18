function OutputPanel({ output }) {
  if (output?.type === "submit") {
    const status = output.status || "Error";
    const isAccepted = status === "Accepted";
    const isWrong = status === "Wrong Answer";
    const statusColor = isAccepted ? "text-emerald-400" : "text-red-400";

    return (
      <div className="output-box">
        <div className="output-header">Verdict</div>
        <div className="output-body">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm font-semibold ${statusColor}`}>{status}</span>
          </div>

          {isAccepted && (
            <p className="text-sm text-emerald-300">All test cases passed.</p>
          )}

          {isWrong && (
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-red-300 font-semibold">Expected</p>
                <pre className="text-sm font-mono whitespace-pre-wrap text-gray-200">
                  {output.expected}
                </pre>
              </div>
              <div>
                <p className="text-red-300 font-semibold">Got</p>
                <pre className="text-sm font-mono whitespace-pre-wrap text-gray-200">
                  {output.got}
                </pre>
              </div>
            </div>
          )}

          {!isAccepted && !isWrong && (
            <div>
              {output.output && (
                <pre className="text-sm font-mono whitespace-pre-wrap mb-2 text-gray-200">
                  {output.output}
                </pre>
              )}
              <pre className="text-sm font-mono whitespace-pre-wrap text-red-300">
                {output.error || "Execution error"}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="output-box">
      <div className="output-header">Output</div>
      <div className="output-body">
        {output === null ? (
          <p className="text-sm text-[var(--text-secondary)]">
            Click "Run Code" to see the output here...
          </p>
        ) : output.success ? (
          <pre className="text-sm font-mono whitespace-pre-wrap">{output.output}</pre>
        ) : (
          <div>
            {output.output && (
              <pre className="text-sm font-mono whitespace-pre-wrap mb-2">
                {output.output}
              </pre>
            )}
            <pre className="text-sm font-mono whitespace-pre-wrap text-red-300">
              {output.error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
export default OutputPanel;
