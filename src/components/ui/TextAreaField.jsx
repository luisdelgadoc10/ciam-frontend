// src/components/ui/TextAreaField.jsx
import React from "react";

export default function TextAreaField({
  label,
  name,
  value,
  onChange,
  error,
  rows = 3,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <textarea
        name={name}
        value={value || ""}
        onChange={onChange}
        rows={rows}
        className="w-full border border-gray-300 dark:border-slate-600 rounded-lg px-3 py-2 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error[0]}</p>}
    </div>
  );
}
