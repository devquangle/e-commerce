import { useEffect } from "react"

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  content?: string
  confirmText?: string
  cancelText?: string
  children?: React.ReactNode
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  content,
  cancelText = "Cancel",
  confirmText = "Confirm",
  children
}: ModalProps) {

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 p-4 "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-md rounded-xl shadow-xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{title}</h2>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded hover:bg-gray-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {content && (
          <p className="text-gray-600 mb-4">{content}</p>
        )}

        {children}

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600 cursor-pointer"
          >
            {cancelText}
          </button>

          {onConfirm && (
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 cursor-pointer"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}