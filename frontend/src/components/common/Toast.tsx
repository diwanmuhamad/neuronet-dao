"use client";
import { Toast as ToastType, useToast } from "../../contexts/ToastContext";

interface ToastProps {
  toast: ToastType;
}

const ToastItem: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToast();

  const getToastStyles = (type: ToastType["type"]) => {
    switch (type) {
      case "success":
        return "toast-glass toast-glass-success";
      case "error":
        return "toast-glass toast-glass-error";
      case "warning":
        return "toast-glass toast-glass-warning";
      case "info":
        return "toast-glass toast-glass-info";
      default:
        return "toast-glass";
    }
  };

  const getIcon = (type: ToastType["type"]) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "";
    }
  };

  return (
    <div
      className={`flex items-center justify-between p-4 mb-3 rounded-lg text-white shadow-lg animate-slide-in ${getToastStyles(
        toast.type,
      )}`}
    >
      <div className="flex items-center">
        <span className="mr-3 text-lg font-bold text-white">
          {getIcon(toast.type)}
        </span>
        <span className="text-sm font-medium text-white">{toast.message}</span>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-4 text-white/80 hover:text-white focus:outline-none"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default ToastContainer;
