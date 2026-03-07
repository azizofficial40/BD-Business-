import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export type NotificationType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type: NotificationType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle size={20} className="text-emerald-500" />,
    error: <AlertCircle size={20} className="text-rose-500" />,
    info: <Info size={20} className="text-indigo-500" />,
  };

  const bgColors = {
    success:
      "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900",
    error:
      "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900",
    info: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900",
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-md animate-in slide-in-from-top-5 fade-in duration-300 ${bgColors[type]} max-w-sm`}
    >
      <div className="shrink-0">{icons[type]}</div>
      <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
        {message}
      </p>
      <button
        onClick={onClose}
        className="shrink-0 p-1 hover:bg-black/5 rounded-full transition-colors"
      >
        <X size={16} className="text-slate-400" />
      </button>
    </div>
  );
};

export default Toast;
