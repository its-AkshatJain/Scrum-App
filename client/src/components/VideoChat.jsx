import React from "react";
import { Video, Users, Settings } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import ControlsToolbar from "./ControlsToolbar";
import InviteBox from "./InviteBox";
import { useWebRTC } from "./useWebRTC";
import Toast from "./Toast";             // You need to create this file or share it
import LoadingSpinner from "./LoadingSpinner"; // You need to create this file or share it
import ConnectionStatus from "./ConnectionStatus"; // You need to create this file or share it

const VideoChat = () => {
  const {
    roomId,
    setRoomId,
    inRoom,
    connectionStatus,
    isMuted,
    videoOff,
    localStream,
    remoteStream,
    isScreenSharing,
    loading,
    toast,
    participantCount,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
    shareScreen,
    showToast,
    setToast
  } = useWebRTC();

  if (!inRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
        
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Video Meet</h1>
            <p className="text-gray-400">Connect with anyone, anywhere</p>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl">
            <div className="space-y-6">
              <button
                onClick={createRoom}
                disabled={loading.create}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading.create ? <LoadingSpinner /> : <Users className="w-5 h-5" />}
                <span>{loading.create ? "Creating..." : "Create New Room"}</span>
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">or join existing room</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Room ID</label>
                  <input
                    type="text"
                    placeholder="Enter room ID"
                    value={roomId}
                    onChange={(e) => {
                      const value = e.target.value.toUpperCase();
                      setRoomId(value);
                      localStorage.setItem("roomId", value);
                    }}
                    className="w-full p-4 bg-gray-900/60 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <button
                  onClick={joinRoom}
                  disabled={loading.join || !roomId.trim()}
                  className="w-full flex items-center justify-center gap-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading.join ? <LoadingSpinner /> : <Video className="w-5 h-5" />}
                  <span>{loading.join ? "Joining..." : "Join Room"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4">
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Video Meeting</h1>
          <ConnectionStatus status={connectionStatus} participantCount={participantCount} />
        </div>
        <div className="flex items-center gap-4">
          <Settings className="w-6 h-6 text-gray-400 hover:text-white cursor-pointer transition-colors" />
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex flex-wrap gap-6 justify-center">
          {localStream && (
            <VideoPlayer 
              stream={localStream} 
              muted 
              isLocal 
              participantName="You"
              connectionStatus={connectionStatus}
            />
          )}
          {remoteStream && (
            <VideoPlayer 
              stream={remoteStream} 
              participantName="Participant"
              connectionStatus={connectionStatus}
            />
          )}
          {!remoteStream && inRoom && (
            <div className="w-96 h-64 rounded-2xl border-2 border-dashed border-gray-600 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-medium">Waiting for others to join...</p>
                <p className="text-gray-500 text-sm">Share the room ID to invite participants</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center mb-6">
        <ControlsToolbar
          isMuted={isMuted}
          videoOff={videoOff}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onShareScreen={shareScreen}
          onLeaveRoom={leaveRoom}
          isScreenSharing={isScreenSharing}
          loading={loading}
        />
      </div>

      {/* Invite Box */}
      <div className="flex justify-center">
        <InviteBox 
          roomId={roomId} 
          onCopy={() => showToast("Room ID copied to clipboard!", "success")} 
        />
      </div>
    </div>
  );
};

export default VideoChat;
