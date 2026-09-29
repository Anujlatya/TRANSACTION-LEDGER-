import {
  Bell,
  Search,
  Sun,
  UserCircle2,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#050816]/80 px-6 backdrop-blur-xl">

      {/* Left */}

      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          Welcome, {user?.name || "User"} 👋
          {user?.role === "ADMIN" && (
            <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider text-amber-400 border border-amber-500/30">
              ADMIN
            </span>
          )}
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Manage your ledger transactions efficiently.
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-4">

        {user?.role === "ADMIN" && (
          <Link
            to="/admin"
            className="hidden sm:flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500 hover:text-black shadow-md shadow-amber-500/10"
          >
            <ShieldCheck size={16} />
            Admin Portal
          </Link>
        )}

        {/* Notifications */}

        <button className="relative rounded-xl bg-white/5 p-3 text-gray-300 transition hover:bg-white/10 hover:text-white">

          <Bell size={20} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>

        </button>

        {/* User */}

        <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2">

          <UserCircle2 size={36} className={user?.role === "ADMIN" ? "text-amber-400" : "text-cyan-400"} />

          <div className="hidden text-left md:block">

            <h4 className="text-sm font-semibold text-white">
              {user?.name || "Guest"}
            </h4>

            <p className="text-xs text-gray-400">
              {user?.email || "guest@example.com"}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}