import { createContext, useContext, useState } from "react";
import { DeleteModal } from "../utils/DeleteModal";

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export function ModalProvider({ children }) {
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showModal = ({ title, message, onConfirm }) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}

      <DeleteModal
        isOpen={modal.isOpen}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onConfirm={() => {
          modal.onConfirm?.();
          closeModal();
        }}
      />
    </ModalContext.Provider>
  );
}
