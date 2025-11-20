import React, { createContext, useContext } from "react";
import useConfirm from "../hooks/useConfirm";
import ConfirmModal from "../components/ui/ConfirmModal";

const ConfirmContext = createContext();

export function ConfirmProvider({ children }) {
  const { confirmState, ask, close } = useConfirm();

  return (
    <ConfirmContext.Provider value={{ ask }}>
      {children}

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        onConfirm={confirmState.onConfirm}
        onCancel={close}
      />
    </ConfirmContext.Provider>
  );
}

export const useConfirmDialog = () => useContext(ConfirmContext);
