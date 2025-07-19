// client/src/components/ControlButton.jsx
import React from "react";
import LoadingSpinner from "./LoadingSpinner";

export default function ControlButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  disabled = false,
  loading = false,
}) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return "bg-red-500 hover:bg-red-600 border-red-400 text-white shadow-red-500/25";
      case "success":
        return "bg-green-500 hover:bg-green-600 border-green-400 text-white shadow-green-500/25";
      case "primary":
        return "bg-blue-500 hover:bg-blue-600 border-blue-400 text-white shadow-blue-500/25";
      case "secondary":
        return "bg-purple-500 hover:bg-purple-600 border-purple-400 text-white shadow-purple-500/25";
      default:
        return "bg-gray-700 hover:bg-gray-600 border-gray-600 text-white shadow-gray-700/25";
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${getVariantStyles()}`}
      title={label}
    >
      {loading ? <LoadingSpinner /> : <Icon className="w-6 h-6 mb-1" />}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
