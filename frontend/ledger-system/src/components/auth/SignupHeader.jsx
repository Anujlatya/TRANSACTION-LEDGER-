import { motion } from "framer-motion";
import {
  UserPlus,
  ShieldCheck,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

export default function SignupHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      {/* Logo */}

      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-500 via-cyan-500 to-blue-600 shadow-[0_0_60px_rgba(16,185,129,.35)]">

        <UserPlus
          className="text-white"
          size={38}
        />

      </div>

      {/* Badge */}

      <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 backdrop-blur-xl">

        <Sparkles
          size={16}
          className="text-emerald-400"
        />

        <span className="text-sm font-medium text-emerald-300">
          Create Your Secure Account
        </span>

      </div>

      {/* Heading */}

      <h1 className="mt-6 text-4xl font-black leading-tight">

        <span className="text-white">
          Join
        </span>

        <br />

        <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
          LedgerX
        </span>

      </h1>

      {/* Description */}

      <p className="mt-4 text-gray-400 leading-7">

        Open your digital banking account in just a few
        seconds. Transfer money, manage accounts,
        receive email notifications and track every
        transaction securely.

      </p>

      {/* Features */}

      <div className="mt-8 space-y-4">

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

          <ShieldCheck
            className="text-green-400"
            size={22}
          />

          <span className="text-gray-300">
            Bank Grade Security
          </span>

        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

          <BadgeCheck
            className="text-cyan-400"
            size={22}
          />

          <span className="text-gray-300">
            Instant Account Creation
          </span>

        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

          <Sparkles
            className="text-violet-400"
            size={22}
          />

          <span className="text-gray-300">
            Real-Time Ledger Tracking
          </span>

        </div>

      </div>
    </motion.div>
  );
}