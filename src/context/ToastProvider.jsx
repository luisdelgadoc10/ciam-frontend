// src/context/ToastProvider.jsx
import { createContext, useContext } from "react";
import { Toaster, toast } from "sonner";
import { CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

const ToastContext = createContext({
  success: () => console.warn("ToastProvider no está envuelto"),
  error: () => console.warn("ToastProvider no está envuelto"),
  warning: () => console.warn("ToastProvider no está envuelto"),
  info: () => console.warn("ToastProvider no está envuelto"),
});

export function ToastProvider({ children }) {
  const variants = {
    success: {
      icon: <CheckCircle className="w-5 h-5 text-white/90" />,
      className: `
        !bg-gradient-to-br !from-emerald-500/80 !to-emerald-700/80
        backdrop-blur-md
        !text-white !border !border-white/10
        !shadow-lg shadow-black/20
      `,
    },
    error: {
      icon: <XCircle className="w-5 h-5 text-white/90" />,
      className: `
        !bg-gradient-to-br !from-red-500/80 !to-red-700/80
        backdrop-blur-md
        !text-white !border !border-white/10
        !shadow-lg shadow-black/20
      `,
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-white/90" />,
      className: `
        !bg-gradient-to-br !from-amber-500/80 !to-orange-600/80
        backdrop-blur-md
        !text-white !border !border-white/10
        !shadow-lg shadow-black/20
      `,
    },
    info: {
      icon: <Info className="w-5 h-5 text-white/90" />,
      className: `
        !bg-gradient-to-br !from-blue-500/80 !to-blue-700/80
        backdrop-blur-md
        !text-white !border !border-white/10
        !shadow-lg shadow-black/20
      `,
    },
  };

  const showToast = (type, message, options = {}) => {
    const variant = variants[type] || variants.info;
    toast(message, {
      icon: variant.icon,
      duration: options.duration || 3500,
      className: `
        !px-5 !py-4 !rounded-xl
        !flex !items-center !gap-3
        !font-medium !text-[15px]
        ${variant.className}
        ${options.className || ""}
      `,
      ...options,
    });
  };

  const api = {
    success: (msg, opt) => showToast("success", msg, opt),
    error: (msg, opt) => showToast("error", msg, opt),
    warning: (msg, opt) => showToast("warning", msg, opt),
    info: (msg, opt) => showToast("info", msg, opt),
  };

  return (
    <ToastContext.Provider value={api}>
      <Toaster
        position="top-right"
        expand={false}
        closeButton
        theme="dark"
        toastOptions={{
          className: "!bg-transparent !shadow-none !p-0",
        }}
      />

      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  return useContext(ToastContext);
}
