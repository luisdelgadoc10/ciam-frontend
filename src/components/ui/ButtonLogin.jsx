// src/components/Button.jsx
export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-3 py-2 rounded-lg font-semibold shadow-md transition-colors duration-200 
        text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
        ${className}`}
    >
      {children}
    </button>
  );
}