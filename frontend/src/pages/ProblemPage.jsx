import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";
import { submitSolution } from "../lib/submit";
import { problemApi } from "../api/problems";

import toast from "react-hot-toast";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problemList, setProblemList] = useState([]);
  const [isLoadingProblems, setIsLoadingProblems] = useState(true);
  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentProblem = useMemo(
    () => problemList.find((problem) => problem.id === currentProblemId) || null,
    [problemList, currentProblemId]
  );

  useEffect(() => {
    let isActive = true;

    const loadProblems = async () => {
      try {
        const data = await problemApi.getProblems();
        if (!isActive) return;
        setProblemList(data?.problems || []);
      } catch (error) {
        if (isActive) {
          setProblemList([]);
        }
      } finally {
        if (isActive) {
          setIsLoadingProblems(false);
        }
      }
    };

    loadProblems();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (id) {
      setCurrentProblemId(id);
    }
  }, [id]);

  useEffect(() => {
    if (!id && !currentProblemId && problemList.length > 0) {
      setCurrentProblemId(problemList[0].id);
    }
  }, [id, currentProblemId, problemList]);

  useEffect(() => {
    if (currentProblem?.starterCode?.[selectedLanguage]) {
      setCode(currentProblem.starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [currentProblem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    if (currentProblem?.starterCode?.[newLang]) {
      setCode(currentProblem.starterCode[newLang]);
    }
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput({ type: "run", ...result });
    setIsRunning(false);

    if (result.success) {
      toast.success("Code executed successfully.");
    } else {
      toast.error("Code execution failed!");
    }
  };

  const handleSubmitCode = async () => {
    setIsSubmitting(true);
    setOutput(null);

    const result = await submitSolution({
      code,
      language: selectedLanguage,
      problemId: currentProblemId,
    });

    setOutput({ type: "submit", ...result });
    setIsSubmitting(false);

    if (result.status === "Accepted") {
      toast.success("Accepted! All test cases passed.");
    } else if (result.status === "Wrong Answer") {
      toast.error("Wrong Answer. Check the failing case.");
    } else {
      toast.error(result.error || "Execution error.");
    }
  };

  if (isLoadingProblems) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="page-wrap">
          <div className="max-w-4xl mx-auto p-6">
            <div className="ca-panel p-8 text-center">
              <p className="text-lg font-semibold">Loading problem...</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Please wait while we fetch the problem details.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="page-wrap">
          <div className="max-w-4xl mx-auto p-6">
            <div className="ca-panel p-8 text-center">
              <p className="text-lg font-semibold">No problem found</p>
              <p className="text-sm text-[var(--text-secondary)]">
                Please refresh or select a valid problem.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      <div className="page-wrap flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={problemList}
            />
          </Panel>

          <PanelResizeHandle className="w-2 ca-resize-handle transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={70} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  isSubmitting={isSubmitting}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onSubmitCode={handleSubmitCode}
                />
              </Panel>

              <PanelResizeHandle className="h-2 ca-resize-handle transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={30} minSize={30}>
                <OutputPanel output={output} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
