import { useMemo } from "react";

const statusLabels = {
  speaking: "Speaking",
  idle: "Listening",
};

function AiAvatar({ isSpeaking, text }) {
  const statusText = useMemo(() => (isSpeaking ? statusLabels.speaking : statusLabels.idle), [isSpeaking]);
  const subtitlePreview = useMemo(() => {
    const value = String(text || "").trim();
    if (!value) return "Ready for your response";
    return value.length > 54 ? `${value.slice(0, 54)}...` : value;
  }, [text]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <div className="absolute -inset-12 rounded-[36px] bg-gradient-to-br from-emerald-400/18 via-cyan-300/12 to-transparent blur-3xl opacity-90" />

      <div className="avatar-silhouette" />

      <div className="relative z-10 w-[76%] aspect-[0.82] rounded-[45%] bg-gradient-to-b from-slate-100/95 via-slate-200/85 to-slate-300/80 p-[3px] animate-avatar-float">
        <div className="w-full h-full rounded-[45%] bg-gradient-to-b from-[#0f1723] to-[#070d14] flex items-center justify-center">
          <div className="w-[74%] h-[76%] flex flex-col items-center justify-center gap-6">
            <div className="avatar-brow" />
            <div className="flex items-center justify-between w-full px-4">
              <span className="avatar-eye avatar-eye-left" />
              <span className="avatar-eye avatar-eye-right" />
            </div>
            <span className={`avatar-mouth ${isSpeaking ? "avatar-mouth-talk" : "avatar-mouth-idle"}`} />
            <div className="avatar-jaw" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-emerald-200/80 backdrop-blur">
        {statusText} • {subtitlePreview}
      </div>
    </div>
  );
}

export default AiAvatar;
