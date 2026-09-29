import { motion } from "framer-motion";
import {
  Send,
  Wallet,
  Receipt,
  Mail,
} from "lucide-react";

const actions = [
  {
    title: "Transfer Money",
    desc: "Instant transfer",
    icon: Send,
    color: "from-cyan-500 to-blue-600",
  },
  {
    title: "Create Account",
    desc: "Open new account",
    icon: Wallet,
    color: "from-violet-500 to-fuchsia-600",
  },
  {
    title: "View Ledger",
    desc: "Transaction history",
    icon: Receipt,
    color: "from-emerald-500 to-green-600",
  },
  {
    title: "Email Statement",
    desc: "Monthly report",
    icon: Mail,
    color: "from-orange-500 to-red-500",
  },
];

export default function QuickActions() {
  return (
    <div>

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-white text-xl font-bold">
          Quick Actions
        </h2>

        <span className="text-sm text-cyan-400">
          Banking Shortcuts
        </span>

      </div>

      <div className="grid grid-cols-2 gap-4">

        {actions.map((action, index) => {

          const Icon = action.icon;

          return (

            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: .8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: index * 0.15,
                duration: .5,
              }}
              whileHover={{
                y: -8,
                scale: 1.05,
                rotateX: 5,
              }}
              whileTap={{
                scale: .96,
              }}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 transition-all duration-300 hover:border-cyan-400/40 hover:bg-white/10 hover:shadow-[0_0_40px_rgba(34,211,238,.18)]"
            >

              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:rotate-6 transition`}
              >

                <Icon
                  size={28}
                  className="text-white"
                />

              </div>

              <h3 className="text-white font-semibold">
                {action.title}
              </h3>

              <p className="text-gray-400 text-sm mt-1">
                {action.desc}
              </p>

            </motion.div>

          );

        })}

      </div>

    </div>
  );
}