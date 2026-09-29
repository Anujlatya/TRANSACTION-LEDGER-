import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldAlert, ArrowLeft, Shield } from "lucide-react";

export default function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-gray-400 font-medium">Verifying RBAC Permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
        <div className="w-full max-w-lg rounded-3xl border border-red-500/30 bg-gradient-to-b from-red-950/20 to-black/80 p-8 text-center shadow-2xl backdrop-blur-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/30">
            <ShieldAlert size={44} />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-400 mb-4">
            <Shield size={14} /> 403 Access Denied
          </span>

          <h2 className="text-3xl font-bold tracking-tight text-white mb-3">
            Administrator Access Required
          </h2>

          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            You are logged in as <span className="font-semibold text-cyan-400">{user.email}</span> with standard <span className="font-semibold text-violet-400">USER</span> privileges. This page is restricted to administrators only.
          </p>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-6 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
          >
            <ArrowLeft size={18} />
            Back to User Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
