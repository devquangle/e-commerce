import toast from "react-hot-toast";

const baseStyle = {
  borderRadius: "8px",
  padding: "10px 14px",
  fontSize: "14px",
};

const toastUtil = {

  success(message: string) {
    toast.success(message, {
      style: {
        ...baseStyle,
        background: "#16a34a",
        color: "#fff",
      },
    });
  },

  error(message: string) {
    toast.error(message, {
      style: {
        ...baseStyle,
        background: "#dc2626",
        color: "#fff",
      },
    });
  },

  loading(message: string) {
    return toast.loading(message, {
      style: {
        ...baseStyle,
        background: "#2563eb",
        color: "#fff",
      },
    });
  },

};

export default toastUtil;