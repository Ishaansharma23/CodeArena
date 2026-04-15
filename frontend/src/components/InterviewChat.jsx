import { useEffect, useRef, useState } from "react";
import { MicIcon, SendIcon, StopCircleIcon, Volume2Icon } from "lucide-react";

function InterviewChat({ messages, onSend, onEnd, isSending, isComplete }) {
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const lastSpokenRef = useRef("");

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechSupported = Boolean(SpeechRecognition);
  const ttsSupported = "speechSynthesis" in window;

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (!ttsEnabled || !ttsSupported || !lastMessage) return;
    if (lastMessage.role !== "assistant") return;
    if (lastMessage.content === lastSpokenRef.current) return;

    const utterance = new SpeechSynthesisUtterance(lastMessage.content);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    lastSpokenRef.current = lastMessage.content;
  }, [messages, ttsEnabled, ttsSupported]);

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
    <div className="card bg-base-100 border-2 border-secondary/20">
      <div className="card-body h-full">
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

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[420px]">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`chat ${message.role === "assistant" ? "chat-start" : "chat-end"}`}
            >
              <div className={`chat-bubble ${message.role === "assistant" ? "chat-bubble-primary" : "chat-bubble"}`}>
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <textarea
            className="textarea textarea-bordered w-full"
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
            <button className="btn btn-primary btn-sm" onClick={handleSend} disabled={isSending || isComplete}>
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
