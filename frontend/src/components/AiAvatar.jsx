import { useMemo } from "react";

const statusLabels = {
  speaking: "Speaking",
  idle: "Listening",
};

function AiAvatar({ isSpeaking }) {
  const statusText = useMemo(() => (isSpeaking ? statusLabels.speaking : statusLabels.idle), [isSpeaking]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-emerald-400/20 via-cyan-400/10 to-transparent blur-2xl opacity-80" />
      <div className="relative z-10 w-[74%] aspect-square rounded-full bg-gradient-to-br from-emerald-400/60 via-cyan-300/40 to-emerald-500/40 p-1 animate-avatar-float">
        <div className="w-full h-full rounded-full bg-[#0b111a] flex items-center justify-center">
          <div className="w-[68%] h-[68%] flex flex-col items-center justify-center gap-6">
            <div className="flex items-center justify-between w-full px-2">
              <span className="avatar-eye" />
              <span className="avatar-eye" />
            </div>
            <span className={`avatar-mouth ${isSpeaking ? "avatar-mouth-talk" : "avatar-mouth-idle"}`} />
          </div>
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-emerald-200/80">
        {statusText}
      </div>
    </div>
  );
}

export default AiAvatar;
