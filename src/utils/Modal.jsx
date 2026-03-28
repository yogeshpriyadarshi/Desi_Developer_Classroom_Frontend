import { useEffect } from "react";

// ✅ Reusable Modal Component
export function Modal({ isOpen, onClose, title, children }) {
  // close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      {/* overlay click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* modal box */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-500">
            ✕
          </button>
        </div>

        {/* content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
