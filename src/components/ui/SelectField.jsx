import React from "react";

export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  className = "",
}) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-sm text-gray-700 dark:text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </p>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg 
          bg-white text-gray-800 
          dark:bg-slate-900 dark:border-slate-700 dark:text-gray-100 
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      >
        <option value="" className="text-gray-400 dark:text-gray-400">
          Seleccione...
        </option>
        {options.map((opt) => (
          <option
            key={opt.id}
            value={opt.id}
            className="text-gray-800 dark:text-gray-100"
          >
            {opt.nombre}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-xs mt-1">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
    </div>
  );
}
