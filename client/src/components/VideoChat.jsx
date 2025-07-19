import VideoPlayer from "./VideoPlayer";
import ControlsToolbar from "./ControlsToolbar";
import InviteBox from "./InviteBox";
import { useWebRTC } from "./useWebRTC";

export default function VideoChat() {
  const {
    roomId,
    setRoomId,
    inRoom,
    message,
    isMuted,
    videoOff,
    localStream,
    remoteStream,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
    shareScreen,
  } = useWebRTC();

  return (
    <div className="p-4 flex flex-col items-center">
      {!inRoom ? (
        <div className="flex flex-col gap-2 items-center">
          <button onClick={createRoom} className="p-2 bg-green-500 text-white rounded">
            Create Room
          </button>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => {
              setRoomId(e.target.value);
              localStorage.setItem("roomId", e.target.value);
            }}
            className="border p-2"
          />
          <button onClick={joinRoom} className="p-2 bg-blue-500 text-white rounded">
            Join Room
          </button>
          <p className="text-gray-600">{message}</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-gray-500">{message}</p>
          <div className="flex gap-4 mt-4">
            {localStream && <VideoPlayer stream={localStream} muted />}
            {remoteStream && <VideoPlayer stream={remoteStream} />}
          </div>
          <ControlsToolbar
            isMuted={isMuted}
            videoOff={videoOff}
            onToggleMute={toggleMute}
            onToggleVideo={toggleVideo}
            onShareScreen={shareScreen}
            onLeaveRoom={leaveRoom}
          />
          <InviteBox roomId={roomId} />
        </div>
      )}
    </div>
  );
}
