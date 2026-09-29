import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Users,
  LayoutDashboard,
  LogOut,
  ChevronLeft,
  Bell,
  UserCircle2,
  Landmark,
  ShieldAlert,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  const navItems = [
    {
      label: "Admin Overview",
      icon: LayoutDashboard,
      path: "/admin",
    },
    {
      label: "Users Management",
      icon: Users,
      path: "/admin/users",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#050816] text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 hidden h-screen w-72 flex-col border-r border-amber-500/20 bg-[#070d19] lg:flex">
        {/* Header / Logo */}
        <div className="border-b border-amber-500/20 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 via-violet-600 to-cyan-400 shadow-lg shadow-amber-500/20">
              <ShieldCheck size={26} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">LedgerX</h2>
                <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
                  ADMIN
                </span>
              </div>
              <p className="text-xs text-gray-400">RBAC Security Console</p>
            </div>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="flex-1 space-y-6 p-4">
          <div>
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-amber-400/80 mb-2">
              System Administration
            </p>
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path === "/admin/users" && location.pathname.startsWith("/admin/users"));
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500/20 to-cyan-500/10 text-amber-300 border border-amber-500/30 shadow-md shadow-amber-500/5"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <Icon size={18} className={isActive ? "text-amber-400" : "text-gray-400"} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="px-4 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Quick Shortcuts
            </p>
            <Link
              to="/dashboard"
              className="flex items-center gap-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm font-medium text-cyan-400 transition hover:bg-cyan-500/10"
            >
              <ChevronLeft size={18} />
              <span>Back to User View</span>
            </Link>
          </div>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-amber-500/20 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-amber-500 text-white font-bold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
            </div>
            <div className="overflow-hidden">
              <h4 className="truncate text-sm font-semibold text-white">{user?.name}</h4>
              <p className="truncate text-xs text-amber-400/90 font-medium">Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-1 flex-col lg:ml-72">
        {/* Topbar */}
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/10 bg-[#050816]/90 px-6 backdrop-blur-xl lg:px-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                Admin Console
                <span className="hidden md:inline-block rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs text-cyan-400 border border-cyan-500/20">
                  RBAC Active
                </span>
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Logged in as Super Administrator ({user?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/dashboard"
              className="hidden sm:flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
            >
              <Landmark size={14} />
              User Dashboard
            </Link>

            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
                <ShieldCheck size={18} />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[10px] text-amber-400 font-mono">ROLE_ADMIN</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
