import { useState } from "react";

export default function useConfirm() {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    message: "",
    title: "",
    onConfirm: null,
  });

  // Abrir el modal
  const ask = ({ title, message }) =>
    new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        onConfirm: () => {
          resolve(true);
          close();
        },
      });
    });

  // Cerrar modal
  const close = () =>
    setConfirmState((prev) => ({ ...prev, isOpen: false }));

  return {
    confirmState,
    ask,
    close,
  };
}
