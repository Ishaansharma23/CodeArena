import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";

const BRAND = "CodeArena";
const TAGLINE = "Where Code Meets Competition";

function Preloader() {
  const { isSignedIn } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(() => !sessionStorage.getItem("arena_loaded"));
  const [isExiting, setIsExiting] = useState(false);

  const letters = useMemo(() => BRAND.split(""), []);

  useEffect(() => {
    if (!visible) return undefined;

    const exitTimer = setTimeout(() => setIsExiting(true), 1800);
    const doneTimer = setTimeout(() => {
      sessionStorage.setItem("arena_loaded", "1");
      setVisible(false);
      setIsExiting(false);

      const shouldRedirect = ["/", "/home", "/login"].includes(location.pathname);
      if (shouldRedirect) {
        navigate(isSignedIn ? "/dashboard" : "/home", { replace: true });
      }
    }, 2200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [visible, isSignedIn, navigate, location.pathname]);

  if (!visible) return null;

  return (
    <div className={`preloader${isExiting ? " hidden" : ""}`}>
      <div className="preloader-brand">
        <div className="preloader-word" aria-label={BRAND}>
          {letters.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="preloader-letter"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="preloader-tagline">{TAGLINE}</p>
        <div className="preloader-bar" aria-hidden="true">
          <div className="preloader-progress" />
        </div>
      </div>
    </div>
  );
}

export default Preloader;
