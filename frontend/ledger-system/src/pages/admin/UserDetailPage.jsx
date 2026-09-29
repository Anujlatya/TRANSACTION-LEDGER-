import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import AccountDetailModal from "../../components/admin/AccountDetailModal";
import {
  getAllUsers,
  getUserAccounts,
  getUserTransactions,
  updateAccountStatus,
  deleteAccount,
  updateUserRole,
  deleteUser,
} from "../../services/adminService";
import {
  ArrowLeft,
  User,
  Shield,
  Landmark,
  Wallet,
  ArrowLeftRight,
  Calendar,
  Mail,
  Key,
  Trash2,
  UserCheck,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUserAndAccounts();
  }, [userId]);

  const fetchUserAndAccounts = async () => {
    setLoading(true);
    try {
      // Fetch user profile from user list
      const usersRes = await getAllUsers();
      if (usersRes?.data) {
        const found = usersRes.data.find((u) => u._id === userId);
        if (found) setUserInfo(found);
      }

      // Fetch user's bank accounts & transactions
      const [accRes, txRes] = await Promise.all([
        getUserAccounts(userId),
        getUserTransactions(userId),
      ]);

      if (accRes?.data) setAccounts(accRes.data);
      if (txRes?.data) setTransactions(txRes.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (accountId, newStatus) => {
    await updateAccountStatus(accountId, newStatus);
    setAccounts((prev) =>
      prev.map((acc) =>
        acc._id === accountId ? { ...acc, status: newStatus } : acc
      )
    );
    if (selectedAccount && selectedAccount._id === accountId) {
      setSelectedAccount((prev) => ({ ...prev, status: newStatus }));
    }
  };

  const handleDeleteAccount = async (accountId) => {
    await deleteAccount(accountId);
    setAccounts((prev) => prev.filter((acc) => acc._id !== accountId));
    setSelectedAccount(null);
  };

  const handleToggleRole = async () => {
    if (!userInfo) return;
    const newRole = userInfo.role === "ADMIN" ? "USER" : "ADMIN";
    setActionLoading(true);
    try {
      await updateUserRole(userInfo._id, newRole);
      setUserInfo((prev) => ({ ...prev, role: newRole }));
    } catch (error) {
      console.error("Failed to update role:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userInfo) return;
    if (
      !window.confirm(
        `Are you sure you want to delete user "${userInfo.name}" and ALL their associated bank accounts? This action cannot be undone.`
      )
    )
      return;

    setActionLoading(true);
    try {
      await deleteUser(userInfo._id);
      navigate("/admin/users");
    } catch (error) {
      console.error("Failed to delete user:", error);
      setActionLoading(false);
    }
  };

  const totalUserBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance || 0),
    0
  );

  const bankColors = [
    "from-cyan-500 via-blue-600 to-indigo-700",
    "from-violet-600 via-purple-600 to-fuchsia-700",
    "from-emerald-500 via-teal-600 to-cyan-700",
    "from-amber-500 via-orange-600 to-red-600",
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Users List
          </Link>

          <span className="text-xs font-mono text-gray-500">USER_ID: {userId}</span>
        </div>

        {loading ? (
          <div className="flex py-20 justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
              <p className="text-sm text-gray-400">Loading user accounts & ledger profile...</p>
            </div>
          </div>
        ) : (
          <>
            {/* FIRST SECTION: USER DETAILS */}
            <section className="rounded-3xl border border-white/10 bg-[#071120] p-6 shadow-2xl backdrop-blur-xl md:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                
                {/* Left: User Header & Avatar */}
                <div className="flex items-start gap-5">
                  <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl font-black text-3xl text-white shadow-xl ${
                      userInfo?.role === "ADMIN"
                        ? "bg-gradient-to-br from-amber-500 to-violet-600 ring-4 ring-amber-500/20 shadow-amber-500/20"
                        : "bg-gradient-to-br from-cyan-500 to-blue-600 ring-4 ring-cyan-500/20 shadow-cyan-500/20"
                    }`}
                  >
                    {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl font-black text-white sm:text-3xl">
                        {userInfo?.name || "User Details"}
                      </h2>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
                          userInfo?.role === "ADMIN"
                            ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                            : "border-cyan-500/40 bg-cyan-500/10 text-cyan-400"
                        }`}
                      >
                        <Shield size={14} />
                        {userInfo?.role || "USER"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Mail size={14} className="text-cyan-400" />
                        <span>{userInfo?.email}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-violet-400" />
                        <span>
                          Member since{" "}
                          {userInfo?.createdAt
                            ? new Date(userInfo.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10 lg:border-t-0 lg:pt-0">
                  <button
                    disabled={actionLoading}
                    onClick={handleToggleRole}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition ${
                      userInfo?.role === "ADMIN"
                        ? "border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                        : "border-cyan-500/40 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20"
                    }`}
                  >
                    <UserCheck size={16} />
                    {userInfo?.role === "ADMIN" ? "Demote to USER" : "Promote to ADMIN"}
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={handleDeleteUser}
                    className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-bold text-rose-400 transition hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 size={16} />
                    Delete User
                  </button>
                </div>
              </div>

              {/* Master Details Metrics */}
              <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-white/10 pt-6">
                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <span className="text-xs text-gray-400">Total Accounts</span>
                  <div className="mt-1 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{accounts.length}</h3>
                    <Landmark size={22} className="text-cyan-400" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <span className="text-xs text-gray-400">Total Combined Balance</span>
                  <div className="mt-1 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-cyan-400">
                      ₹{totalUserBalance.toLocaleString("en-IN")}
                    </h3>
                    <Wallet size={22} className="text-emerald-400" />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
                  <span className="text-xs text-gray-400">Transactions Ledger</span>
                  <div className="mt-1 flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-white">{transactions.length}</h3>
                    <ArrowLeftRight size={22} className="text-violet-400" />
                  </div>
                </div>
              </div>
            </section>

            {/* SECOND SECTION: USER ACCOUNTS (CARD GRID) */}
            <section className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold text-white flex items-center gap-2">
                    <CreditCard className="text-cyan-400" size={24} />
                    User Bank Accounts
                  </h3>
                  <p className="text-xs text-gray-400">
                    Click any account card to view details, update status (ACTIVE/FROZEN/CLOSED) or delete account.
                  </p>
                </div>

                <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-400 border border-cyan-500/20">
                  {accounts.length} Accounts Found
                </span>
              </div>

              {accounts.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-[#070d19] py-12 text-center">
                  <Landmark size={40} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-gray-400 text-sm">This user currently has no bank accounts created.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {accounts.map((acc, index) => {
                    const gradient = bankColors[index % bankColors.length];
                    const statusClass =
                      acc.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                        : acc.status === "FROZEN"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        : "bg-rose-500/20 text-rose-400 border-rose-500/40";

                    return (
                      <div
                        key={acc._id}
                        onClick={() => {
                          setSelectedAccount(acc);
                          setModalOpen(true);
                        }}
                        className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/10 to-black/60 p-6 backdrop-blur-2xl shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-400/50 hover:shadow-cyan-500/10 cursor-pointer"
                      >
                        {/* Decorative Top Pill */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-2">
                            <div className={`h-8 w-8 rounded-xl bg-gradient-to-r ${gradient} flex items-center justify-center shadow-md`}>
                              <Landmark size={18} className="text-white" />
                            </div>
                            <span className="text-xs font-bold tracking-widest uppercase text-white/80">
                              LedgerX Bank
                            </span>
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${statusClass}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                            {acc.status}
                          </span>
                        </div>

                        {/* Balance Display */}
                        <div className="mb-6">
                          <span className="text-[11px] uppercase tracking-wider text-gray-400">
                            Available Balance
                          </span>
                          <h4 className="text-3xl font-extrabold text-white group-hover:text-cyan-400 transition">
                            ₹{Number(acc.balance || 0).toLocaleString("en-IN")}
                          </h4>
                        </div>

                        {/* Account Number & Card Footer */}
                        <div className="flex items-end justify-between border-t border-white/10 pt-4">
                          <div>
                            <span className="text-[10px] uppercase text-gray-500">Account Number</span>
                            <p className="font-mono text-sm font-bold tracking-widest text-gray-200">
                              {acc.accountNumber}
                            </p>
                          </div>

                          <span className="text-xs font-semibold text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            Actions &rarr;
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* THIRD SECTION (CREATIVE ADDITION): USER TRANSACTION HISTORY */}
            <section className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <ArrowLeftRight className="text-violet-400" size={20} />
                    User Transaction Audit Trail
                  </h3>
                  <p className="text-xs text-gray-400">Recent transfers involving this user's accounts</p>
                </div>
              </div>

              {transactions.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-[#070d19] py-8 text-center text-xs text-gray-400">
                  No transaction history recorded for this user.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#070d19]">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-white/10 bg-white/5 uppercase text-gray-400 font-semibold">
                      <tr>
                        <th className="p-3.5">Transaction ID</th>
                        <th className="p-3.5">From Account</th>
                        <th className="p-3.5">To Account</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                      {transactions.slice(0, 10).map((tx) => (
                        <tr key={tx._id} className="hover:bg-white/5 transition">
                          <td className="p-3.5 font-mono text-cyan-400">{tx._id.slice(-8)}</td>
                          <td className="p-3.5 font-mono">{tx.fromAccount?.accountNumber || "N/A"}</td>
                          <td className="p-3.5 font-mono">{tx.toAccount?.accountNumber || "N/A"}</td>
                          <td className="p-3.5 font-bold text-white">₹{Number(tx.amount || 0).toLocaleString("en-IN")}</td>
                          <td className="p-3.5">
                            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                              {tx.status || "COMPLETED"}
                            </span>
                          </td>
                          <td className="p-3.5 text-gray-400">
                            {new Date(tx.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}

      </div>

      {/* Account Action & Detail Modal */}
      <AccountDetailModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedAccount(null);
        }}
        account={selectedAccount}
        userName={userInfo?.name}
        userEmail={userInfo?.email}
        onStatusChange={handleStatusChange}
        onDeleteAccount={handleDeleteAccount}
      />
    </AdminLayout>
  );
}
