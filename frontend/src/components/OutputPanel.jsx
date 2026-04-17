function OutputPanel({ output }) {
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
