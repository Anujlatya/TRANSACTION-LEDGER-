import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

import LoginHeader from "../auth/LoginHeader";
import LoginForm from "../auth/LoginForm";



export default function LoginModal({
  isOpen,
  onClose,
  onSignup,
}) {

  const navigate = useNavigate();

  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>

      {isOpen && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
        >

          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 40,
              scale: 0.9,
            }}
            transition={{
              duration: 0.35,
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-6xl overflow-hidden rounded-[35px] border border-white/10 bg-[#07111f]/95 backdrop-blur-3xl shadow-[0_0_80px_rgba(59,130,246,.25)]"
          >

            {/* Close Button */}

            <button
              onClick={onClose}
              className="absolute right-6 top-6 z-50 rounded-full bg-white/10 p-2 text-white transition hover:bg-red-500"
            >
              <X size={22} />
            </button>

            <div className="grid lg:grid-cols-2">

              {/* LEFT */}

              <div className="relative overflow-hidden p-12">

                {/* Glow */}

                <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl" />

                <div className="absolute bottom-0 right-0 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />

                <div className="relative z-10">

                  <LoginHeader />

                </div>

              </div>

              {/* RIGHT */}

              <div className="flex items-center bg-white/[0.03] p-10">

                <div className="w-full">

                  <LoginForm
                    onSignup={onSignup}
                    loading={false}
                    onSubmit={async (data) => {
                      try {
                        await loginUser(data);
                        const userObj = await checkAuth();

                        if (userObj?.role === "ADMIN") {
                          navigate("/admin");
                        } else {
                          navigate("/dashboard");
                        }
                        onClose();
                      } catch (error) {
                        console.log("Login error:", error.response?.data || error.message);
                        alert(error.response?.data?.message || "Login failed. Please check your credentials.");
                      }
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