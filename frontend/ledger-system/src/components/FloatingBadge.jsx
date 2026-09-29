import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Bell,
  CheckCircle2,
} from "lucide-react";

const iconMap = {
  Secure: ShieldCheck,
  Transactions: Zap,
  Notifications: Bell,
  Success: CheckCircle2,
};

export default function FloatingBadge({
  title,
  value,
  top,
  bottom,
  left,
  right,
}) {
  const Icon = iconMap[title] || ShieldCheck;

  return (
    <motion.div
      animate={{
        y: [0, -12, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        top,
        bottom,
        left,
        right,
      }}
      className="absolute z-30"
    >
      <div className="group flex items-center gap-3 rounded-2xl border border-cyan-400/20 bg-white/10 px-4 py-3 backdrop-blur-2xl shadow-[0_10px_50px_rgba(34,211,238,.18)] transition-all duration-300 hover:scale-105 hover:border-cyan-400/50">

        {/* Icon */}

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600">

          <Icon
            className="text-white"
            size={22}
          />

        </div>

        {/* Text */}

        <div>

          <p className="text-xs uppercase tracking-widest text-gray-400">

            {title}

          </p>

          <h3 className="text-white font-bold">

            {value}

          </h3>

        </div>

      </div>
    </motion.div>
  );
}