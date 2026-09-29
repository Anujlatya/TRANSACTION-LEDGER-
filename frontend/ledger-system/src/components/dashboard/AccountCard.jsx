import { Landmark, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function AccountCard({
  bankName,
  accountNumber,
  balance,
  accountType,
  color = "from-cyan-500 to-blue-600",
}) {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/40">

      {/* Glow */}

      <div
        className={`absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-r ${color} opacity-20 blur-3xl`}
      />

      {/* Header */}

      <div className="relative flex items-center justify-between">

        <div className="flex items-center gap-3">

          <div
            className={`rounded-2xl bg-gradient-to-r ${color} p-3`}
          >
            <Landmark className="text-white" size={26} />
          </div>

          <div>

            <h3 className="font-semibold text-white">
              {bankName}
            </h3>

            <p className="text-sm text-gray-400">
              {accountType}
            </p>

          </div>

        </div>

        <button
          onClick={() => setShowBalance(!showBalance)}
          className="rounded-xl bg-white/10 p-2 text-gray-300 transition hover:bg-white/20"
        >
          {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>

      </div>

      {/* Account Number */}

      <div className="relative mt-8">

        <p className="text-sm text-gray-500">
          Account Number
        </p>

        <h2 className="mt-2 text-xl tracking-[4px] text-white">
          {accountNumber}
        </h2>

      </div>

      {/* Balance */}

      <div className="relative mt-8">

        <p className="text-sm text-gray-500">
          Available Balance
        </p>

        <h1 className="mt-2 text-4xl font-bold text-white">

          {showBalance
            ? `₹${balance.toLocaleString()}`
            : "••••••••"}

        </h1>

      </div>

      {/* Footer */}

      <div className="relative mt-8 flex items-center justify-between">

        <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-400">
          Active
        </span>

        <button
          className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm text-cyan-400 transition hover:bg-cyan-500 hover:text-black"
        >
          View Details
        </button>

      </div>

    </div>
  );
}