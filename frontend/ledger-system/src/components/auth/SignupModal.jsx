import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import SignupHeader from "../auth/SignupHeader";
import SignupForm from "../auth/SignupForm";

export default function SignupModal({
  isOpen,
  onClose,
  onLogin,
}) {

  useEffect(() => {

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      document.removeEventListener("keydown", handleKeyDown);
    };

  }, [isOpen, onClose]);

  return (

    <AnimatePresence>

      {isOpen && (

        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >

          <motion.div

            onClick={(e) => e.stopPropagation()}

            initial={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}

            exit={{
              opacity: 0,
              scale: 0.9,
              y: 40,
            }}

            transition={{
              duration: 0.35,
            }}

            className="relative w-full max-w-6xl overflow-hidden rounded-[35px] border border-white/10 bg-[#07111f]/95 backdrop-blur-3xl shadow-[0_0_80px_rgba(16,185,129,.25)]"

          >

            {/* Close */}

            <button

              onClick={onClose}

              className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-2 text-white transition hover:bg-red-500"

            >

              <X size={22} />

            </button>

            {/* Background Glow */}

            <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl"></div>

            <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>

            <div className="grid lg:grid-cols-2">

              {/* Left */}

              <div className="relative p-12">

                <SignupHeader />

              </div>

              {/* Right */}

              <div className="flex items-center bg-white/[0.03] p-10">

                <div className="w-full">

                  <SignupForm
                    onLogin={onLogin}
                    onSubmit={() => {
                      onClose();
                      onLogin();
                    }}
                  />

                </div>

              </div>

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>

  );

}