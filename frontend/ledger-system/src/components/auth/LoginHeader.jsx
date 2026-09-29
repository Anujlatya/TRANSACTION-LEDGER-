import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  LockKeyhole,
} from "lucide-react";

export default function LoginHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      {/* Logo */}

      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 shadow-[0_0_50px_rgba(34,211,238,.35)]">

        <LockKeyhole
          className="text-white"
          size={38}
        />

      </div>

      {/* Welcome Badge */}

      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-2 backdrop-blur-xl">

        <Sparkles
          size={16}
          className="text-cyan-400"
        />

        <span className="text-sm text-cyan-300 font-medium">
          Secure Banking Experience
        </span>

      </div>

      {/* Heading */}

      <h1 className="mt-6 text-4xl font-black leading-tight">

        <span className="text-white">
          Welcome Back
        </span>

        <br />

        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
          to LedgerX
        </span>

      </h1>

      {/* Subtitle */}

      <p className="mt-4 text-gray-400 leading-7">

        Sign in to access your secure banking dashboard,
        manage your accounts and perform transactions
        with confidence.

      </p>

      {/* Features */}

      <div className="mt-8 grid grid-cols-3 gap-3">

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

          <ShieldCheck
            className="mx-auto text-green-400"
            size={24}
          />

          <p className="mt-2 text-xs text-gray-300">
            256-bit SSL
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

          <Sparkles
            className="mx-auto text-cyan-400"
            size={24}
          />

          <p className="mt-2 text-xs text-gray-300">
            Fast Login
          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">

          <LockKeyhole
            className="mx-auto text-violet-400"
            size={24}
          />

          <p className="mt-2 text-xs text-gray-300">
            Secure Access
          </p>

        </div>

      </div>
    </motion.div>
  );
}