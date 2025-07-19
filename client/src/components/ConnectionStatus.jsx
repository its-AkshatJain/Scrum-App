// frontend/src/components/ConnectionStatus.jsx
import React from "react";
import { Wifi, WifiOff, Users } from "lucide-react"; // <-- Import icons

export default function ConnectionStatus({ status, participantCount = 1 }) {
  const getStatusInfo = () => {
    switch (status) {
      case "connected":
        return { icon: Wifi, color: "text-green-400", text: "Connected" };
      case "connecting":
        return { icon: WifiOff, color: "text-yellow-400", text: "Connecting..." };
      case "disconnected":
        return { icon: WifiOff, color: "text-red-400", text: "Disconnected" };
      default:
        return { icon: WifiOff, color: "text-gray-400", text: "Idle" };
    }
  };

  const { icon: StatusIcon, color, text } = getStatusInfo();

  return (
    <div className="flex items-center gap-4 text-sm text-gray-400">
      <div className={`flex items-center gap-2 ${color}`}>
        <StatusIcon className="w-4 h-4" />
        <span>{text}</span>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4" />
        <span>
          {participantCount} participant{participantCount !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}
