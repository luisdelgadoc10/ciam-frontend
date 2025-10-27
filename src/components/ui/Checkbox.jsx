import React from "react";

export default function Checkbox({
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false,
  className = "",
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        id={id}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only" // Oculto visualmente, pero accesible
      />
      <label
        htmlFor={id}
        className={`
          flex items-center justify-center
          w-5 h-5
          rounded
          border
          cursor-pointer
          transition-colors
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${
            checked
              ? "bg-blue-600 border-blue-600" // Marcado: azul 600
              : "border-gray-300 bg-white"   // No marcado
          }
          hover:${checked ? "bg-blue-700" : "border-gray-400"}
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        `}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </label>
      {label && (
        <span
          className={`ml-2 text-gray-700 ${disabled ? "opacity-70" : ""}`}
        >
          {label}
        </span>
      )}
    </div>
  );
}