import React from "react";

export default function AuthInput({
  icon: Icon,
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-300 font-medium">
        {label}
      </label>

      <div className="relative">

        {Icon && (
          <Icon
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
        )}

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-12 pr-4 text-white placeholder-gray-500 outline-none backdrop-blur-xl transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
        />

      </div>
    </div>
  );
}