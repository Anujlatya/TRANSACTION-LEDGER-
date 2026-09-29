import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import {
  getAdminDashboardMetrics,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../../services/adminService";
import {
  Users,
  Landmark,
  ArrowLeftRight,
  Wallet,
  Search,
  Filter,
  Shield,
  ShieldAlert,
  ChevronRight,
  UserCheck,
  UserX,
  RefreshCcw,
  Sparkles,
  MoreVertical,
  Trash2,
  CheckCircle,
} from "lucide-react";

export default function AdminUsersPage() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalUser: 0,
    totalAccounts: 0,
    totalTransaction: 0,
    totalTransactionMoney: 0,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metricsRes, usersRes] = await Promise.all([
        getAdminDashboardMetrics(),
        getAllUsers(),
      ]);
      if (metricsRes?.data) setMetrics(metricsRes.data);
      if (usersRes?.data) setUsers(usersRes.data);
    } catch (error) {
      console.error("Failed to load admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (e, userId, currentRole) => {
    e.stopPropagation();
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    setActionLoading(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async (e, userId, userName) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete user "${userName}" and all their bank accounts?`)) return;
    setActionLoading(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Welcome & Overview Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-amber-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                System Overview
              </span>
            </div>
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              User Management & RBAC Console
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage system permissions, view user bank accounts, and control account lifecycles.
            </p>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <RefreshCcw size={16} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>

        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          
          <div className="rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-950/5 to-black/40 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-amber-400">Total Users</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                <Users size={20} />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-white">{metrics.totalUser}</h2>
            <p className="mt-1 text-xs text-gray-400">Registered RBAC accounts</p>
          </div>

          <div className="rounded-3xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-cyan-950/5 to-black/40 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-cyan-400">Bank Accounts</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Landmark size={20} />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-white">{metrics.totalAccounts}</h2>
            <p className="mt-1 text-xs text-gray-400">Active ledger accounts</p>
          </div>

          <div className="rounded-3xl border border-violet-500/20 bg-gradient-to-br from-violet-500/10 via-violet-950/5 to-black/40 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-violet-400">Transactions</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400">
                <ArrowLeftRight size={20} />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-white">{metrics.totalTransaction}</h2>
            <p className="mt-1 text-xs text-gray-400">Executed ledger transfers</p>
          </div>

          <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-950/5 to-black/40 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-emerald-400">Volume Cleared</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Wallet size={20} />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-white">
              ₹{Number(metrics.totalTransactionMoney || 0).toLocaleString("en-IN")}
            </h2>
            <p className="mt-1 text-xs text-gray-400">Total settled capital</p>
          </div>

        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-[#070d19] p-4">
          
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
              <Filter size={16} />
              <span>Role:</span>
            </div>
            <div className="flex rounded-xl border border-white/10 bg-black/40 p-1">
              {["ALL", "USER", "ADMIN"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                    roleFilter === role
                      ? "bg-cyan-500 text-black shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Users List Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              Registered Users
              <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-cyan-400">
                {filteredUsers.length}
              </span>
            </h3>
            <p className="text-xs text-gray-400">Click any user card to inspect details & bank accounts</p>
          </div>

          {loading ? (
            <div className="flex py-16 justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
                <p className="text-sm text-gray-400">Fetching users from ledger backend...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#070d19] py-16 text-center">
              <UserX size={44} className="mx-auto text-gray-600 mb-3" />
              <h4 className="text-lg font-bold text-white">No Users Found</h4>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria or role filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((u) => {
                const isAdmin = u.role === "ADMIN";
                const isItemLoading = actionLoading === u._id;

                return (
                  <div
                    key={u._id}
                    onClick={() => navigate(`/admin/users/${u._id}`)}
                    className="group relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#071120] p-4 transition-all duration-300 hover:border-cyan-500/50 hover:bg-[#0b172a] hover:shadow-xl hover:shadow-cyan-500/5 sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                  >
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-xl text-white shadow-lg transition-transform group-hover:scale-105 ${
                          isAdmin
                            ? "bg-gradient-to-br from-amber-500 to-violet-600 shadow-amber-500/20 ring-2 ring-amber-500/30"
                            : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20"
                        }`}
                      >
                        {u.name ? u.name.charAt(0).toUpperCase() : "U"}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition">
                            {u.name}
                          </h4>
                          
                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider ${
                              isAdmin
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                                : "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                            }`}
                          >
                            <Shield size={12} />
                            {u.role || "USER"}
                          </span>
                        </div>

                        <p className="text-xs text-gray-400 font-medium">{u.email}</p>
                        <p className="text-[11px] text-gray-500">
                          Joined: {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    </div>

                    {/* Actions & Navigation */}
                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <button
                        title={isAdmin ? "Demote to USER" : "Promote to ADMIN"}
                        disabled={isItemLoading}
                        onClick={(e) => handleToggleRole(e, u._id, u.role)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          isAdmin
                            ? "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                            : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                        }`}
                      >
                        <UserCheck size={14} />
                        <span>{isAdmin ? "Make User" : "Make Admin"}</span>
                      </button>

                      <button
                        title="Delete User"
                        disabled={isItemLoading}
                        onClick={(e) => handleDeleteUser(e, u._id, u.name)}
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 transition hover:bg-rose-500 hover:text-white"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform pl-2">
                        <span>View Accounts</span>
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
