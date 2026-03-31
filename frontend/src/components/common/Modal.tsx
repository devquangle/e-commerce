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
  confirmText = "Confirm",
  children
}: ModalProps) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/40 p-4"
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
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          </button>
        </div>

        {content && (
          <p className="text-gray-600 mb-4">{content}</p>
        )}

        {children}

        <div className="flex justify-end gap-3 mt-6">
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
  )
}