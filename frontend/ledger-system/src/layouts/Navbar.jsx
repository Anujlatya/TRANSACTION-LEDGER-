import { useState } from "react";
import { Menu, X, Landmark, ChevronRight } from "lucide-react";

export default function Navbar({ openLogin, openSignup }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
      <div className="max-w-7xl mx-auto h-20 px-6 flex items-center justify-between">

        {/* Logo */}

        <div className="flex items-center gap-3 cursor-pointer">

          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">

            <Landmark className="w-6 h-6 text-white" />

          </div>

          <div>

            <h1 className="text-white font-bold text-xl">
              LedgerX
            </h1>

            <p className="text-xs text-gray-400">
              Modern Banking Ledger
            </p>

          </div>

        </div>

        {/* Desktop Menu */}

        <nav className="hidden lg:flex items-center gap-8">

          <a
            href="#features"
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            Features
          </a>

          <a
            href="#workflow"
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            Workflow
          </a>

          <a
            href="#security"
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            Security
          </a>

          <a
            href="#about"
            className="text-gray-300 hover:text-cyan-400 transition"
          >
            About
          </a>

        </nav>

        {/* Desktop Buttons */}

        <div className="hidden lg:flex items-center gap-4">

          <button
            onClick={openLogin}
            className="px-5 py-2 rounded-xl border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all duration-300"
          >
            Login
          </button>

          <button
            onClick={openSignup}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 text-white flex items-center gap-2 hover:scale-105 transition duration-300"
          >
            Get Started

            <ChevronRight size={18} />

          </button>

        </div>

        {/* Mobile Button */}

        <button
          className="lg:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* Mobile Menu */}

      {isOpen && (

        <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-white/10">

          <div className="flex flex-col px-6 py-6 gap-6">

            <a href="#features" className="text-white">
              Features
            </a>

            <a href="#workflow" className="text-white">
              Workflow
            </a>

            <a href="#security" className="text-white">
              Security
            </a>

            <a href="#about" className="text-white">
              About
            </a>

            <button
              onClick={openLogin}
              className="border border-cyan-500 rounded-xl py-3 text-cyan-400"
            >
              Login
            </button>

            <button
              onClick={openSignup}
              className="bg-gradient-to-r from-violet-600 to-cyan-500 rounded-xl py-3 text-white"
            >
              Create Account
            </button>

          </div>

        </div>

      )}

    </header>
  );
}