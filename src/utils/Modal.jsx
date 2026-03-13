function Modal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-3">{title}</h2>

        <p className="text-gray-600 mb-5">{message}</p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>

          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
