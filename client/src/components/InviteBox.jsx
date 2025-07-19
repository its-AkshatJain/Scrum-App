import React, { useState } from "react";
import { Users, Copy } from "lucide-react";

const InviteBox = ({ roomId, onCopy }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-2xl p-6 max-w-md w-full">
      <div className="flex items-center gap-3 mb-4">
        <Users className="w-5 h-5 text-blue-400" />
        <h3 className="text-white font-semibold">Invite Others</h3>
      </div>
      
      <div className="flex items-center gap-3 p-3 bg-gray-900/60 rounded-xl border border-gray-600">
        <div className="flex-1">
          <p className="text-gray-400 text-xs mb-1">Room ID</p>
          <p className="text-white font-mono text-sm break-all">{roomId}</p>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <Copy className="w-4 h-4" />
          <span className="text-sm font-medium">
            {copied ? "Copied!" : "Copy"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default InviteBox;
