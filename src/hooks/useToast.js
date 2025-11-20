// src/hooks/useToast.js
import { useToastContext } from "../context/ToastProvider";

export default function useToast() {
  const toast = useToastContext();

  return {
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
  };
}
