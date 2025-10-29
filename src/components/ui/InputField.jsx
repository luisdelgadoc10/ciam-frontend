import React from "react";

export default function InputField({
  label,
  type = "text",
  name,
  value,
  onChange,
  required,
  placeholder,
  disabled = false,
}) {
  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label className="text-sm text-gray-500 font-medium">{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full border border-gray-300 bg-gray-50 text-gray-900 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
          disabled ? "opacity-70 cursor-not-allowed" : ""
        }`}
      />
    </div>
  );
}
