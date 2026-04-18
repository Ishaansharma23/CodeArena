import { useEffect, useRef, useState } from "react";
import { MicIcon, SendIcon, StopCircleIcon, Volume2Icon } from "lucide-react";

function InterviewChat({ messages, onSend, onEnd, isSending, isComplete }) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true); // 🔥 default ON
  const lastSpokenRef = useRef("");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechSupported = Boolean(SpeechRecognition);
  const ttsSupported = "speechSynthesis" in window;

  // 🔥 FIXED AI SPEAKING
  useEffect(() => {
    if (!ttsEnabled || !ttsSupported || !messages.length) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.role !== "assistant") return;

    // 🔥 FORCE speak even if similar (avoid skip bug)
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(lastMessage.content);

    utterance.onstart = () => {
      setIsListening(false); // stop mic when AI speaks
    };

    utterance.onend = () => {
      lastSpokenRef.current = lastMessage.content;
    };

    window.speechSynthesis.speak(utterance);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const handleVoiceInput = () => {
    if (!speechSupported || isListening) return;

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
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };

    recognition.start();
  };

  return (
    <div className="ca-panel h-full">
      <div className="h-full p-5 flex flex-col">
        
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-black">AI Interview</h2>

          <div className="flex items-center gap-2">
            {ttsSupported && (
              <button
                className={`btn btn-sm ${ttsEnabled ? "btn-secondary" : "btn-ghost"}`}
                onClick={() => setTtsEnabled((prev) => !prev)}
              >
                <Volume2Icon className="size-4" />
                {ttsEnabled ? "Voice On" : "Voice Off"}
              </button>
            )}

            <button className="btn btn-error btn-sm" onClick={onEnd}>
              <StopCircleIcon className="size-4" />
              End
            </button>
          </div>
        </div>

        {/* 🔥 TRANSCRIPT FIXED */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[420px]">
          {messages.map((message) => (
            <div
              key={message._id || message.content} // 🔥 FIXED KEY
              className={`chat ${message.role === "assistant" ? "chat-start" : "chat-end"}`}
            >
              <div
                className={`chat-bubble ${
                  message.role === "assistant"
                    ? "chat-bubble-primary"
                    : "chat-bubble"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <textarea
            className="ca-input w-full"
            rows={3}
            placeholder={isComplete ? "Interview complete. End to view report." : "Type your answer..."}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isComplete || isSending}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {speechSupported && (
                <button
                  className={`btn btn-outline btn-sm ${isListening ? "btn-secondary" : ""}`}
                  onClick={handleVoiceInput}
                >
                  <MicIcon className="size-4" />
                  {isListening ? "Listening..." : "Voice"}
                </button>
              )}
            </div>

            <button
              className="btn btn-primary btn-sm"
              onClick={handleSend}
              disabled={isSending || isComplete}
            >
              <SendIcon className="size-4" />
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewChat;