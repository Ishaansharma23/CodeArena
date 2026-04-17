import { Link, useLocation } from "react-router";
import {
  BookOpenIcon,
  Code2Icon,
  FileTextIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  ZapIcon,
} from "lucide-react";
import { UserButton } from "@clerk/clerk-react";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <nav className="ca-nav">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="ca-logo group">
          <div className="ca-logo-mark">
            <ZapIcon className="size-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="ca-logo-text">
              <span>Code</span>
              <span>Arena</span>
            </span>
            <span className="text-xs text-[var(--text-secondary)]">Where Code Meets Competition</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to={"/problems"}
            className={`ca-nav-link ${isActive("/problems") ? "active" : ""}`}
          >
            <span className="flex items-center gap-2 text-sm">
              <BookOpenIcon className="size-4" />
              Problems
            </span>
          </Link>

          <Link
            to={"/upload-resume"}
            className={`ca-nav-link ${isActive("/upload-resume") ? "active" : ""}`}
          >
            <span className="flex items-center gap-2 text-sm">
              <FileTextIcon className="size-4" />
              Resume
            </span>
          </Link>

          <Link
            to={"/interview"}
            className={`ca-nav-link ${isActive("/interview") ? "active" : ""}`}
          >
            <span className="flex items-center gap-2 text-sm">
              <MessageSquareIcon className="size-4" />
              AI Interview
            </span>
          </Link>

          <Link
            to={"/dashboard"}
            className={`ca-nav-link ${isActive("/dashboard") ? "active" : ""}`}
          >
            <span className="flex items-center gap-2 text-sm">
              <LayoutDashboardIcon className="size-4" />
              Dashboard
            </span>
          </Link>

          <Link to={"/problems"} className="btn btn-ghost btn-sm">
            <Code2Icon className="size-4" />
          </Link>

          <div className="ml-2">
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
