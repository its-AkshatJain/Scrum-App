// frontend/src/components/VideoPlayer.js
import { useEffect, useRef } from "react";

export default function VideoPlayer({ stream, muted = false, className = "" }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted={muted}
      className={`w-64 h-48 bg-black rounded ${className}`}
    />
  );
}
