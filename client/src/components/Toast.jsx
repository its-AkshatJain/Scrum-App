// frontend/src/components/Toast.jsx
import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info } from "lucide-react"; // Icons

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case "success":
        return "bg-green-500/90 text-white border-green-400";
      case "error":
        return "bg-red-500/90 text-white border-red-400";
      default:
        return "bg-blue-500/90 text-white border-blue-400";
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border backdrop-blur-sm shadow-lg animate-in slide-in-from-top-2 ${getColors()}`}
    >
      {getIcon()}
      <span className="font-medium">{message}</span>
    </div>
  );
}
