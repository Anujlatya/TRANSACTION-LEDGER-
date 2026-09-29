import {
  LayoutDashboard,
  Landmark,
  ArrowLeftRight,
  ReceiptText,
  User,
  Settings,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { logoutUser } from "../../services/authService";

export default function Sidebar() {
  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
    },
    {
      icon: Landmark,
      label: "Accounts",
      path: "/dashboard",
    },
    {
      icon: ArrowLeftRight,
      label: "Transfer",
      path: "/dashboard",
    },
    {
      icon: ReceiptText,
      label: "Transactions",
      path: "/ledger",
    },
  ];

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logoutUser(); // Backend cookie clear
      logout(); // Context user = null
      navigate("/", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-white/10 bg-[#07111f] lg:flex lg:flex-col">

      {/* Logo */}
      <div className="flex items-center justify-between border-b border-white/10 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600">
            <Landmark className="text-white" size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              LedgerX
            </h2>
            <p className="text-sm text-gray-400">
              Banking System
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 space-y-6 p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <li key={index}>
                <button
                  onClick={() => navigate(item.path)}
                  className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* RBAC Admin Portal Link */}
        {user?.role === "ADMIN" && (
          <div className="pt-4 border-t border-amber-500/20">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-amber-400 mb-2">
              RBAC Administration
            </p>
            <Link
              to="/admin"
              className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-300 transition hover:bg-amber-500 hover:text-black shadow-md shadow-amber-500/10"
            >
              <ShieldCheck size={20} />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-red-400 transition hover:bg-red-500/10"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>

    </aside>
  );
}