import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ToastOptions {
  id?: string | number;
}

const commonSettings = {
  position: "top-right" as const,
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: { marginTop: '45px' }
};

export const showSuccessToast = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...commonSettings, theme: "colored", toastId: options?.id || "success-id" });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...commonSettings, toastId: options?.id || "error-id" });
};

export const showWarningToast = (message: string, options?: ToastOptions) => {
  toast.warning(message, { ...commonSettings, toastId: options?.id || "warning-id" });
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...commonSettings, toastId: options?.id || "info-id" });
};

export const dismissToast = (id: string | number) => {
  toast.dismiss(id);
};