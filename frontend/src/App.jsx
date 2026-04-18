import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { Navigate, Route, Routes, useLocation } from "react-router";
import HomePage from "./pages/HomePage";

import { Toaster } from "react-hot-toast";
import DashboardPage from "./pages/DashboardPage";
import ProblemPage from "./pages/ProblemPage";
import ProblemsPage from "./pages/ProblemsPage";
import SessionPage from "./pages/SessionPage";
import UploadResumePage from "./pages/UploadResumePage";
import InterviewPage from "./pages/InterviewPage";
import LiveInterviewPage from "./pages/LiveInterviewPage";
import ReportPage from "./pages/ReportPage";
import Preloader from "./components/Preloader";

function App() {
  const { isSignedIn, isLoaded } = useUser();
  const location = useLocation();

  useEffect(() => {
    const handleRipple = (event) => {
      const target = event.target.closest("button, .btn, [data-ripple]");
      if (!target || target.disabled) return;

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      ripple.className = "ripple";
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      target.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    };

    document.addEventListener("pointerdown", handleRipple);
    return () => document.removeEventListener("pointerdown", handleRipple);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof document === "undefined") return undefined;

    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll("[data-reveal]").forEach((element) => {
        element.classList.add("is-visible");
      });
      return undefined;
    }

    const revealInView = () => {
      const viewportHeight = window.innerHeight || 0;
      document.querySelectorAll("[data-reveal]").forEach((element) => {
        const rect = element.getBoundingClientRect();
        const inView = rect.top < viewportHeight * 0.9 && rect.bottom > 0;
        if (inView) {
          element.classList.add("is-visible");
        }
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const observeElement = (element) => {
      if (!element || element.dataset.revealObserved === "true") return;
      element.dataset.revealObserved = "true";
      observer.observe(element);
    };

    const observeTree = (root) => {
      if (!root || root.nodeType !== 1) return;
      if (root.matches?.("[data-reveal]")) {
        observeElement(root);
      }
      root.querySelectorAll?.("[data-reveal]").forEach((element) => observeElement(element));
    };

    observeTree(document.body);

    const rafId = requestAnimationFrame(revealInView);
    const forceReveal = !["/", "/home"].includes(location.pathname);
    const fallbackTimer = setTimeout(() => {
      if (forceReveal) {
        document.querySelectorAll("[data-reveal]").forEach((element) => {
          element.classList.add("is-visible");
        });
      } else {
        revealInView();
      }
    }, 600);

    let mutationObserver;
    if (typeof MutationObserver !== "undefined") {
      mutationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => observeTree(node));
        });
        revealInView();
      });

      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(fallbackTimer);
      observer.disconnect();
      mutationObserver?.disconnect();
    };
  }, [location.pathname, isLoaded]);

  // this will get rid of the flickering effect
  if (!isLoaded) return null;

  return (
    <div className="app-shell">
      <Preloader />
      <div key={location.pathname} className="page-transition">
        <Routes>
          <Route path="/" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
          <Route path="/home" element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
          <Route path="/dashboard" element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />

          <Route path="/problems" element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
          <Route path="/problem/:id" element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
          <Route path="/session/:id" element={isSignedIn ? <SessionPage /> : <Navigate to={"/"} />} />
          <Route
            path="/upload-resume"
            element={isSignedIn ? <UploadResumePage /> : <Navigate to={"/"} />}
          />
          <Route path="/interview" element={isSignedIn ? <InterviewPage /> : <Navigate to={"/"} />} />
          <Route
            path="/live-interview"
            element={isSignedIn ? <LiveInterviewPage /> : <Navigate to={"/"} />}
          />
          <Route path="/report/:id" element={isSignedIn ? <ReportPage /> : <Navigate to={"/"} />} />
        </Routes>
      </div>

      <Toaster toastOptions={{ duration: 3000 }} />
    </div>
  );
}

export default App;
