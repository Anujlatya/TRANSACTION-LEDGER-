import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Sparkles } from "lucide-react";

export default function HeroContent() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -60 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8"
    >
      {/* Badge */}

      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-cyan-300 backdrop-blur-xl">

        <Sparkles size={18} />

        <span className="text-sm font-medium">
          Next Generation Banking Ledger
        </span>

      </div>

      {/* Heading */}

      <h1 className="text-5xl md:text-7xl font-black leading-tight tracking-tight">

        <span className="text-white">
          Banking
        </span>

        <br />

        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">

          Reimagined.

        </span>

      </h1>

      {/* Description */}

      <p className="max-w-xl text-lg leading-8 text-gray-400">

        Build secure digital banking experiences with instant transfers,
        smart ledger management, email notifications and real-time
        transaction tracking.

      </p>

      {/* Buttons */}

      <div className="flex flex-wrap gap-5">

        <button
          className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-7 py-4 font-semibold text-white transition duration-300 hover:scale-105"
        >
          Get Started

          <ArrowRight
            className="transition group-hover:translate-x-1"
            size={20}
          />

        </button>

        <button
          className="rounded-xl border border-white/20 bg-white/5 px-7 py-4 font-semibold text-white backdrop-blur-xl transition hover:border-cyan-400 hover:bg-cyan-500/10"
        >
          Live Demo
        </button>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-5 pt-8">

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

          <h2 className="text-3xl font-bold text-cyan-400">

            99.99%

          </h2>

          <p className="mt-2 text-sm text-gray-400">

            Uptime

          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

          <h2 className="text-3xl font-bold text-violet-400">

            24/7

          </h2>

          <p className="mt-2 text-sm text-gray-400">

            Secure Ledger

          </p>

        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">

          <ShieldCheck
            className="text-green-400 mb-2"
            size={28}
          />

          <p className="text-sm text-gray-400">

            Bank Grade Security

          </p>

        </div>

      </div>

    </motion.div>
  );
}