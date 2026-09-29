import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  change,
  positive = true,
  color = "from-cyan-500 to-blue-600",
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-cyan-400/30 hover:bg-white/10">

      {/* Background Glow */}

      <div
        className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-r ${color} opacity-20 blur-3xl`}
      />

      {/* Header */}

      <div className="relative flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-400">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-white">
            {value}
          </h2>

        </div>

        <div
          className={`rounded-2xl bg-gradient-to-r ${color} p-4 shadow-lg`}
        >
          <Icon className="text-white" size={28} />
        </div>

      </div>

      {/* Footer */}

      <div className="relative mt-6 flex items-center gap-2">

        {positive ? (
          <ArrowUpRight className="text-green-400" size={18} />
        ) : (
          <ArrowDownRight className="text-red-400" size={18} />
        )}

        <span
          className={`text-sm font-medium ${
            positive ? "text-green-400" : "text-red-400"
          }`}
        >
          {change}
        </span>

        <span className="text-sm text-gray-500">
          vs last month
        </span>

      </div>
    </div>
  );
}