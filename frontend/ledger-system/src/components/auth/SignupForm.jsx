import { useState } from "react";
import { User, Mail, ArrowRight } from "lucide-react";

import { registerUser } from "../../services/authService";
import AuthInput from "../auth/AuthInput";
import PasswordInput from "../auth/PasswordInput";
import LoadingSpinner from "../auth/LoadingSpinner";

export default function SignupForm({
  onLogin,
  onSubmit,
  loading = false,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.acceptTerms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log(response.data);

      alert("Account Created Successfully!");

      if (onSubmit) {
        onSubmit(response.data);
      }

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
        "Registration Failed"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Full Name */}

      <AuthInput
        icon={User}
        label="Full Name"
        placeholder="Enter your full name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      {/* Email */}

      <AuthInput
        icon={Mail}
        label="Email Address"
        type="email"
        placeholder="Enter your email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      {/* Password */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Password
        </label>

        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          name="password"
          placeholder="Create a strong password"
        />
      </div>

      {/* Terms */}

      <label className="flex items-start gap-3 text-sm text-gray-400">
        <input
          type="checkbox"
          name="acceptTerms"
          checked={formData.acceptTerms}
          onChange={handleChange}
          className="mt-1 h-4 w-4 accent-emerald-500"
        />

        <span>
          I agree to the{" "}
          <a href="#" className="text-cyan-400 hover:underline">
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-cyan-400 hover:underline">
            Privacy Policy
          </a>
        </span>
      </label>
      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 py-3 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <LoadingSpinner text="Creating Account..." />
        ) : (
          <>
            Create Account
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Switch */}

      <div className="border-t border-white/10 pt-5">
        <p className="text-center text-sm text-gray-400">
          Already have an account?
        </p>

        <button
          type="button"
          onClick={() => onLogin?.()}
          className="mt-3 w-full rounded-xl border border-cyan-500/40 py-3 font-semibold text-cyan-400 transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
        >
          Sign In
        </button>
      </div>
    </form>
  );
}