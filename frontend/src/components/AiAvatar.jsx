import { useMemo } from "react";

const statusLabels = {
  speaking: "Speaking",
  idle: "Listening",
};

function AiAvatar({ isSpeaking, text }) {
  const statusText = useMemo(
    () => (isSpeaking ? statusLabels.speaking : statusLabels.idle),
    [isSpeaking]
  );

  const subtitlePreview = useMemo(() => {
    const value = String(text || "").trim();
    if (!value) return "Ready for your response";
    return value.length > 54 ? `${value.slice(0, 54)}...` : value;
  }, [text]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      
      {/* 🔥 Glow background (reduced + cleaner) */}
      <div className="absolute -inset-6 rounded-[36px] bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent blur-2xl opacity-60" />

      {/* existing silhouette (kept) */}
      <div className="avatar-silhouette opacity-30" />

      {/* 🔥 MAIN AI ORB (upgraded) */}
      <div className="relative z-10 flex items-center justify-center">
        
        {/* Outer glow pulse */}
        <div
          className={`absolute w-40 h-40 rounded-full blur-2xl transition-all duration-300 ${
            isSpeaking
              ? "bg-blue-500/40 scale-110 animate-pulse"
              : "bg-slate-500/20"
          }`}
        />

        {/* Core circle */}
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center shadow-xl">
          
          {/* 🔥 Wave animation */}
          <div className="flex items-end gap-[3px]">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`w-[3px] rounded bg-white/80 transition-all ${
                  isSpeaking ? "animate-bounce" : ""
                }`}
                style={{
                  height: isSpeaking ? `${10 + i * 6}px` : "6px",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

        </div>
      </div>

      {/* 🔥 Subtitle (better glass UI) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 border border-white/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.22em] text-slate-300 backdrop-blur-xl shadow-md">
        {statusText} • {subtitlePreview}
      </div>
    </div>
  );
}

export default AiAvatar;