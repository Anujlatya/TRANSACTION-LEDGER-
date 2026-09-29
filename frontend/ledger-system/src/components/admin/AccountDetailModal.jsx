import { useState } from "react";
import { X, ShieldAlert, CheckCircle2, AlertTriangle, Trash2, Landmark, RefreshCw, AlertCircle } from "lucide-react";

export default function AccountDetailModal({
  isOpen,
  onClose,
  account,
  userName,
  userEmail,
  onStatusChange,
  onDeleteAccount,
}) {
  const [updating, setUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (!isOpen || !account) return null;

  const handleStatusUpdate = async (newStatus) => {
    if (newStatus === account.status) return;
    setUpdating(true);
    setErrorMsg("");
    setSuccessMsg("");
    try {
      await onStatusChange(account._id, newStatus);
      setSuccessMsg(`Account status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to update account status");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setUpdating(true);
    setErrorMsg("");
    try {
      await onDeleteAccount(account._id);
      onClose();
    } catch (err) {
      setErrorMsg(err?.response?.data?.message || "Failed to delete account");
      setUpdating(false);
    }
  };

  const statusColors = {
    ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    FROZEN: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    CLOSED: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-[#0a101d] p-6 text-white shadow-2xl md:p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Landmark size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Account Control & Audit</h3>
              <p className="text-xs text-gray-400">Account #{account.accountNumber}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setConfirmDelete(false);
              onClose();
            }}
            className="rounded-xl border border-white/10 bg-white/5 p-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Account Details Card */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-xs text-gray-400">Account Holder</span>
              <h4 className="text-base font-semibold text-white">{userName || "Unknown User"}</h4>
              <p className="text-xs text-gray-400">{userEmail}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400">Current Balance</span>
              <h3 className="text-2xl font-bold text-cyan-400">
                ₹{Number(account.balance || 0).toLocaleString("en-IN")}
              </h3>
              <span className="text-xs font-medium text-gray-400">{account.currency || "INR"}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400">Account ID</span>
              <p className="font-mono text-gray-200 truncate">{account._id}</p>
            </div>
            <div>
              <span className="text-gray-400">Status</span>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold ${statusColors[account.status] || statusColors.ACTIVE}`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current"></span>
                  {account.status}
                </span>
              </div>
            </div>
            <div>
              <span className="text-gray-400">Created Date</span>
              <p className="text-gray-200">{new Date(account.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
            </div>
            <div>
              <span className="text-gray-400">Currency</span>
              <p className="text-gray-200">{account.currency || "INR"}</p>
            </div>
          </div>
        </div>

        {/* Status Change Section */}
        <div className="mt-6">
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Change Account Status</h4>
          <div className="grid grid-cols-3 gap-3">
            {[
              { status: "ACTIVE", label: "Active", color: "hover:border-emerald-500/50 hover:bg-emerald-500/10 text-emerald-400", icon: CheckCircle2 },
              { status: "FROZEN", label: "Freeze", color: "hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-400", icon: AlertTriangle },
              { status: "CLOSED", label: "Close", color: "hover:border-rose-500/50 hover:bg-rose-500/10 text-rose-400", icon: ShieldAlert },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = account.status === item.status;
              return (
                <button
                  key={item.status}
                  disabled={updating}
                  onClick={() => handleStatusUpdate(item.status)}
                  className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-semibold transition-all ${
                    isActive
                      ? "border-cyan-500 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/10"
                      : `border-white/10 bg-white/5 ${item.color}`
                  }`}
                >
                  {updating && account.status !== item.status ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Icon size={14} />
                  )}
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Danger Zone: Delete Account */}
        <div className="mt-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-semibold text-rose-400">Delete Bank Account</h5>
              <p className="text-xs text-gray-400">Permanently remove this account from the ledger database.</p>
            </div>

            {!confirmDelete ? (
              <button
                disabled={updating}
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500 hover:text-white"
              >
                <Trash2 size={14} />
                Delete Account
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  disabled={updating}
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-500"
                >
                  {updating ? <RefreshCw size={14} className="animate-spin" /> : "Confirm Delete"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="rounded-xl border border-white/10 px-3 py-2 text-xs text-gray-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
