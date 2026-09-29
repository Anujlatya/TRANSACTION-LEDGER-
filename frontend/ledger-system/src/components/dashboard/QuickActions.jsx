import {
  PlusCircle,
  ArrowLeftRight,
  ReceiptText,
  ChartColumn,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickActions({
  onCreateAccount,
  onTransferMoney,
}) {

  const navigate = useNavigate();
  const actions = [
    {
      title: "Create Account",
      description: "Open a new bank account",
      icon: PlusCircle,
      color: "from-cyan-500 to-blue-600",
      onClick: onCreateAccount,
    },
    {
      title: "Transfer Money",
      description: "Send money instantly",
      icon: ArrowLeftRight,
      color: "from-emerald-500 to-teal-600",
      onClick: onTransferMoney,
    },
    {
      title: "View Ledger",
      description: "Check all ledger entries",
      icon: ReceiptText,
      color: "from-violet-500 to-fuchsia-600",
      onClick: () => navigate("/ledger"),
    }
  ];

  return (
    <section className="mt-40">
      <h2 className="mb-20 text-3xl font-bold text-white">
        Quick Actions
      </h2>

      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
        {actions.map((item, index) => {
          const Icon = item.icon;

          return (
            <button
              key={index}
              onClick={item.onClick}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/30 h-50 w-80"
            >
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-r ${item.color} opacity-20 blur-3xl`}
              />

              <div
                className={`mb-5 inline-flex rounded-2xl bg-gradient-to-r ${item.color} p-4`}
              >
                <Icon className="text-white" size={28} />
              </div>

              <h3 className="text-xl font-semibold text-white">
                {item.title}
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}