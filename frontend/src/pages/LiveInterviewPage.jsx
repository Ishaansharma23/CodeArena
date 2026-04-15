import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import toast from "react-hot-toast";
import {
  Loader2Icon,
  MicIcon,
  MicOffIcon,
  PhoneOffIcon,
  SendIcon,
  VideoIcon,
  VideoOffIcon,
  Volume2Icon,
  VolumeXIcon,
} from "lucide-react";

import AiAvatar from "../components/AiAvatar";
import { useEndInterview, useInterviewById, useSubmitAnswer } from "../hooks/useInterviews";

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

const getStageLabel = (questionIndex) => {
  if (questionIndex <= 0) return "Intro";
  if (questionIndex <= 2) return "Resume";
  if (questionIndex <= 5) return "Projects";
  if (questionIndex <= 8) return "Technical";
  if (questionIndex <= 10) return "Behavioral";
  return "Closing";
};

function LiveInterviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const state = location.state || {};
  const initialInterviewId = state.interviewId || searchParams.get("interviewId") || "";
  const initialQuestion = state.initialQuestion || "";

  const [interviewId] = useState(initialInterviewId);
  const [messages, setMessages] = useState(() =>
    initialQuestion ? [{ role: "assistant", content: initialQuestion }] : []
  );
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestion);
  const [answer, setAnswer] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [subtitles, setSubtitles] = useState(initialQuestion);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [mediaError, setMediaError] = useState("");
  const [endPayload, setEndPayload] = useState(null);

  const submitMutation = useSubmitAnswer();
  const endMutation = useEndInterview();

  const { data: interviewData, isLoading: interviewLoading } = useInterviewById(interviewId);

  const userVideoRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const lastSpokenRef = useRef("");

  const assistantCount = useMemo(
    () => messages.filter((message) => message.role === "assistant").length,
    [messages]
  );
  const questionIndex = Math.max(0, assistantCount - 1);
  const stageLabel = getStageLabel(questionIndex);

  const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  const SpeechRecognition =
    typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);

  useEffect(() => {
    if (!interviewId && !initialQuestion) {
      toast.error("Interview session not found.");
      navigate("/interview");
    }
  }, [interviewId, initialQuestion, navigate]);

  useEffect(() => {
    if (!interviewData?.interview || messages.length) return;
    const history = interviewData.interview.history || [];
    if (history.length) {
      setMessages(history);
      const lastAssistant = [...history].reverse().find((message) => message.role === "assistant");
      if (lastAssistant) {
        setCurrentQuestion(lastAssistant.content);
        setSubtitles(lastAssistant.content);
      }
    }
    if (interviewData.interview.status === "completed") {
      setIsComplete(true);
    }
  }, [interviewData, messages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initMedia = async () => {
      if (!navigator?.mediaDevices?.getUserMedia) {
        setMediaError("Media devices are not supported in this browser.");
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!isMounted) return;
        mediaStreamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Media devices error:", error);
        if (isMounted) {
          setMediaError("Camera or microphone access was blocked.");
        }
      }
    };

    initMedia();

    return () => {
      isMounted = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!mediaStreamRef.current) return;
    mediaStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = micEnabled;
    });
  }, [micEnabled]);

  useEffect(() => {
    if (!mediaStreamRef.current) return;
    mediaStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = cameraEnabled;
    });
  }, [cameraEnabled]);

  useEffect(() => {
    if (!speechSupported) return;
    if (!ttsEnabled) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    if (!currentQuestion || currentQuestion === lastSpokenRef.current) return;

    const utterance = new SpeechSynthesisUtterance(currentQuestion);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    lastSpokenRef.current = currentQuestion;
    setSubtitles(currentQuestion);

    return () => {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    };
  }, [currentQuestion, ttsEnabled, speechSupported]);

  const handleSend = () => {
    if (!answer.trim() || !interviewId || isComplete) return;
    const trimmed = answer.trim();
    setAnswer("");

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);

    submitMutation.mutate(
      { id: interviewId, payload: { answer: trimmed } },
      {
        onSuccess: (result) => {
          if (result?.question) {
            setMessages((prev) => [...prev, { role: "assistant", content: result.question }]);
            setCurrentQuestion(result.question);
            setSubtitles(result.question);
          } else if (!result?.isComplete) {
            toast.error("No question returned. Please try again.");
          }

          if (result?.isComplete) {
            setIsComplete(true);
          }
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || "Failed to submit answer.");
        },
      }
    );
  };

  const handleEnd = () => {
    if (!interviewId || endMutation.isPending) return;
    endMutation.mutate(interviewId, {
      onSuccess: (result) => {
        window.speechSynthesis?.cancel?.();
        setIsSpeaking(false);
        setEndPayload(result);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || "Failed to end interview.");
      },
    });
  };

  const handleVoiceInput = () => {
    if (!SpeechRecognition || isListening) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      if (transcript) {
        setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognition.start();
  };

  const recentMessages = messages.slice(-4);
  const showLoading = !currentQuestion && (interviewLoading || !messages.length);

  return (
    <div className="min-h-screen interview-bg text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.18),transparent_45%),radial-gradient(circle_at_80%_15%,rgba(34,211,238,0.16),transparent_45%)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-8 space-y-6 animate-fade-in">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">AI Video Interview</p>
            <h1 className="text-3xl font-semibold text-white">Live Interview Session</h1>
            <p className="text-sm text-slate-300">Stage: {stageLabel}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="interview-panel px-4 py-2">
              <p className="text-xs uppercase tracking-[0.32em] text-emerald-200/60">Timer</p>
              <p className="text-lg font-semibold text-white">{formatDuration(timerSeconds)}</p>
            </div>
            <div className="interview-panel px-4 py-2">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-200/60">Status</p>
              <p className="text-sm text-slate-200">{isComplete ? "Complete" : "In Progress"}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="interview-panel relative overflow-hidden aspect-video">
              <AiAvatar isSpeaking={isSpeaking} />
              <div className="absolute left-4 top-4 rounded-full bg-emerald-500/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-emerald-200">
                AI Interviewer
              </div>
              <div className="absolute inset-x-6 bottom-5 rounded-2xl bg-black/50 px-4 py-3 text-sm text-slate-100 shadow-lg backdrop-blur">
                {subtitles || "The interviewer is getting ready..."}
              </div>
            </div>

            <div className="interview-panel px-5 py-4">
              <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Recent Transcript</p>
              <div className="mt-3 space-y-3">
                {recentMessages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`rounded-2xl px-4 py-3 text-sm shadow-sm ${
                      message.role === "assistant"
                        ? "bg-emerald-500/10 border border-emerald-400/20"
                        : "bg-white/10 border border-white/10"
                    }`}
                  >
                    <span className="block text-[11px] uppercase tracking-[0.24em] text-slate-400">
                      {message.role === "assistant" ? "Interviewer" : "You"}
                    </span>
                    <p className="mt-1 text-slate-100">{message.content}</p>
                  </div>
                ))}
                {!recentMessages.length && (
                  <p className="text-sm text-slate-400">Waiting for the first question...</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="interview-panel relative overflow-hidden aspect-video">
              {mediaError ? (
                <div className="h-full flex items-center justify-center text-center px-6">
                  <p className="text-sm text-rose-200">{mediaError}</p>
                </div>
              ) : (
                <>
                  <video
                    ref={userVideoRef}
                    className={`h-full w-full object-cover ${cameraEnabled ? "opacity-100" : "opacity-0"}`}
                    autoPlay
                    playsInline
                    muted
                  />
                  {!cameraEnabled && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
                      <p className="text-sm text-slate-300">Camera is off</p>
                    </div>
                  )}
                </>
              )}
              <div className="absolute left-4 top-4 rounded-full bg-cyan-500/20 px-3 py-1 text-xs uppercase tracking-[0.28em] text-cyan-200">
                You
              </div>
            </div>

            <div className="interview-panel px-5 py-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Your Response</p>
                {SpeechRecognition && (
                  <button
                    className={`text-xs uppercase tracking-[0.28em] transition ${
                      isListening ? "text-emerald-200" : "text-slate-400"
                    }`}
                    onClick={handleVoiceInput}
                  >
                    {isListening ? "Listening..." : "Dictate"}
                  </button>
                )}
              </div>
              <textarea
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400/40"
                rows={4}
                placeholder={isComplete ? "Interview complete. End to view report." : "Type your answer..."}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSend();
                  }
                }}
                disabled={isComplete || submitMutation.isPending}
              />
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400">AI follows up based on your response quality.</p>
                <button
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-xs uppercase tracking-[0.28em] text-emerald-200 transition hover:bg-emerald-500/30"
                  onClick={handleSend}
                  disabled={submitMutation.isPending || isComplete}
                >
                  <SendIcon className="size-4" />
                  {submitMutation.isPending ? "Sending" : "Send"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            className={`control-btn ${micEnabled ? "control-btn-on" : "control-btn-off"}`}
            onClick={() => setMicEnabled((prev) => !prev)}
          >
            {micEnabled ? <MicIcon className="size-5" /> : <MicOffIcon className="size-5" />}
            <span>{micEnabled ? "Mic" : "Mic Off"}</span>
          </button>
          <button
            className={`control-btn ${cameraEnabled ? "control-btn-on" : "control-btn-off"}`}
            onClick={() => setCameraEnabled((prev) => !prev)}
          >
            {cameraEnabled ? <VideoIcon className="size-5" /> : <VideoOffIcon className="size-5" />}
            <span>{cameraEnabled ? "Camera" : "Camera Off"}</span>
          </button>
          {speechSupported && (
            <button
              className={`control-btn ${ttsEnabled ? "control-btn-on" : "control-btn-off"}`}
              onClick={() => setTtsEnabled((prev) => !prev)}
            >
              {ttsEnabled ? <Volume2Icon className="size-5" /> : <VolumeXIcon className="size-5" />}
              <span>{ttsEnabled ? "Voice" : "Muted"}</span>
            </button>
          )}
          <button className="control-btn control-btn-danger" onClick={handleEnd}>
            <PhoneOffIcon className="size-5" />
            <span>{endMutation.isPending ? "Ending" : "End Interview"}</span>
          </button>
        </div>
      </div>

      {showLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#0b0f14]/80 backdrop-blur">
          <div className="interview-panel px-8 py-6 text-center">
            <Loader2Icon className="mx-auto mb-3 h-8 w-8 animate-spin text-emerald-300" />
            <p className="text-sm text-slate-200">Preparing your interview space...</p>
          </div>
        </div>
      )}

      {endPayload && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#0b0f14]/85 backdrop-blur">
          <div className="interview-panel max-w-lg px-8 py-8 text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-emerald-200/70">Interview Ended</p>
            <h2 className="text-2xl font-semibold text-white">Great work today!</h2>
            <p className="text-sm text-slate-300">
              {endPayload?.report?.summary || "Your interview report is ready."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                className="control-btn control-btn-on"
                onClick={() => {
                  const reportId = endPayload?.interview?._id;
                  if (reportId) {
                    navigate(`/report/${reportId}`);
                  } else {
                    navigate("/dashboard");
                  }
                }}
              >
                View Report
              </button>
              <button className="control-btn" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveInterviewPage;
