// frontend/src/components/VideoPlayer.js
import { useEffect, useRef, useState } from "react";
import { Camera, MicOff } from "lucide-react"; // Import icons
import LoadingSpinner from "./LoadingSpinner"; // Import spinner

export default function VideoPlayer({
  stream,
  muted = false,
  isLocal = false,
  participantName = "",
  connectionStatus = "connected",
}) {
  const videoRef = useRef(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideo, setHasVideo] = useState(true);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        setHasVideo(videoTrack.enabled);
        videoTrack.addEventListener("ended", () => setHasVideo(false));
      }
    }
  }, [stream]);

  const handleVideoLoad = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div
      className={`relative rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl ${
        isLocal
          ? "w-72 h-48 border-2 border-blue-400"
          : "w-96 h-64 border-2 border-gray-600"
      }`}
    >
      {!isVideoLoaded && (
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}

      {stream && hasVideo ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={muted}
          onLoadedData={handleVideoLoad}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Camera className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-300 font-medium">
              {participantName || "Participant"}
            </p>
            <p className="text-gray-500 text-sm">Camera off</p>
          </div>
        </div>
      )}

      {/* User Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                connectionStatus === "connected"
                  ? "bg-green-400"
                  : connectionStatus === "connecting"
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-red-400"
              }`}
            />
            <span className="text-white font-medium text-sm">
              {participantName || (isLocal ? "You" : "Participant")}
            </span>
          </div>
          {isLocal && (
            <span className="bg-blue-500/80 px-2 py-1 rounded-full text-xs font-medium text-white">
              Local
            </span>
          )}
        </div>
      </div>

      {/* Muted Indicator
      {muted && (
        <div className="absolute top-4 right-4 bg-red-500/90 p-2 rounded-full">
          <MicOff className="w-4 h-4 text-white" />
        </div>
      )} */}
    </div>
  );
}
