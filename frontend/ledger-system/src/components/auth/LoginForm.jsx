import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import PasswordInput from "../auth/PasswordInput";

export default function LoginForm({
  onSignup,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Email */}

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Email Address
        </label>

        <div className="relative">

          <Mail
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none backdrop-blur-xl transition focus:border-cyan-400"
          />

        </div>
      </div>

      {/* Password */}

      <div>
        <label className="mb-2 block text-sm text-gray-300">
          Password
        </label>

        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          name="password"
        />
      </div>

      {/* Remember Me */}

      <div className="flex items-center justify-between">

        <label className="flex items-center gap-2 text-sm text-gray-400">

          <input
            type="checkbox"
            name="remember"
            checked={formData.remember}
            onChange={handleChange}
            className="h-4 w-4 accent-cyan-500"
          />

          Remember Me

        </label>

        <button
          type="button"
          className="text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          Forgot Password?
        </button>

      </div>

      {/* Login Button */}

      <button
        type="submit"
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Signing In..." : "Sign In"}

        {!loading && (
          <ArrowRight
            size={18}
            className="transition group-hover:translate-x-1"
          />
        )}
      </button>

      {/* Divider */}

      <div className="relative py-2">

        <div className="absolute left-0 right-0 top-1/2 border-t border-white/10"></div>

        <span className="relative mx-auto block w-fit bg-[#0b1120] px-4 text-sm text-gray-400">
          OR
        </span>

      </div>

      {/* Google Button (UI Only) */}

      <button
        type="button"
        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 font-medium text-white transition hover:border-cyan-400 hover:bg-white/10"
      >
        Continue with Google
      </button>

      {/* Switch to Signup */}

      <p className="text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSignup}
          className="font-semibold text-cyan-400 hover:text-cyan-300"
        >
          Create Account
        </button>
      </p>
    </motion.form>
  );
}