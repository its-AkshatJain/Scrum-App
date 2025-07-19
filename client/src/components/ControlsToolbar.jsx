// frontend/src/components/ControlsToolbar.js
export default function ControlsToolbar({
  isMuted,
  videoOff,
  onToggleMute,
  onToggleVideo,
  onShareScreen,
  onLeaveRoom,
}) {
  return (
    <div className="flex gap-2 mt-4">
      <button onClick={onToggleMute} className="p-2 bg-gray-700 text-white rounded">
        {isMuted ? "Unmute" : "Mute"}
      </button>
      <button onClick={onToggleVideo} className="p-2 bg-gray-700 text-white rounded">
        {videoOff ? "Start Video" : "Stop Video"}
      </button>
      <button onClick={onShareScreen} className="p-2 bg-purple-500 text-white rounded">
        Share Screen
      </button>
      <button onClick={onLeaveRoom} className="p-2 bg-red-500 text-white rounded">
        Leave Room
      </button>
    </div>
  );
}
