// src/components/Input.jsx
export default function Input({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  highlightLabel = false,
  className = "",
  ...props
}) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label
          className={`mb-1 text-sm ${
            highlightLabel
              ? "text-gray-900 font-medium" // 👈 Ahora en morado cuando está destacado
              : "text-gray-700 font-normal"
          }`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 text-gray-900 bg-gray-50 border border-gray-300 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition-all text-sm"
        {...props}
      />
    </div>
  );
}