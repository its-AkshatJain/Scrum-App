import React from "react";
import { Mic, MicOff, Video, VideoOff, Monitor, PhoneOff } from "lucide-react";
import ControlButton from "./ControlButton"; 

const ControlsToolbar = ({
  isMuted,
  videoOff,
  onToggleMute,
  onToggleVideo,
  onShareScreen,
  onLeaveRoom,
  isScreenSharing = false,
  loading = {}
}) => {
  return (
    <div className="flex items-center gap-4 p-6 bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-700 shadow-2xl">
      <ControlButton
        icon={isMuted ? MicOff : Mic}
        label={isMuted ? "Unmute" : "Mute"}
        onClick={onToggleMute}
        variant={isMuted ? "danger" : "default"}
        loading={loading.audio}
      />
      
      <ControlButton
        icon={videoOff ? VideoOff : Video}
        label={videoOff ? "Start Video" : "Stop Video"}
        onClick={onToggleVideo}
        variant={videoOff ? "danger" : "default"}
        loading={loading.video}
      />
      
      <ControlButton
        icon={Monitor}
        label={isScreenSharing ? "Stop Sharing" : "Share Screen"}
        onClick={onShareScreen}
        variant={isScreenSharing ? "success" : "secondary"}
        loading={loading.screen}
      />
      
      <div className="w-px h-12 bg-gray-600 mx-2" />
      
      <ControlButton
        icon={PhoneOff}
        label="Leave"
        onClick={onLeaveRoom}
        variant="danger"
        loading={loading.leave}
      />
    </div>
  );
};

export default ControlsToolbar;
