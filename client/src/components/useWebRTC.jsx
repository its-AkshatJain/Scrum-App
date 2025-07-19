import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const socket = io(SOCKET_URL);

export const useWebRTC = () => {
  const [roomId, setRoomId] = useState(() => localStorage.getItem("roomId") || "");
  const [inRoom, setInRoom] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("idle");
  const [isMuted, setIsMuted] = useState(() =>
    JSON.parse(localStorage.getItem("isMuted") || "false")
  );
  const [videoOff, setVideoOff] = useState(() =>
    JSON.parse(localStorage.getItem("videoOff") || "false")
  );
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [loading, setLoading] = useState({});
  const [toast, setToast] = useState(null);
  const [participantCount, setParticipantCount] = useState(1);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const peerConnection = useRef(null);
  const screenStreamRef = useRef(null);

  const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  // Update mic/camera state persistence
  useEffect(() => {
    localStorage.setItem("isMuted", JSON.stringify(isMuted));
    localStorage.setItem("videoOff", JSON.stringify(videoOff));
  }, [isMuted, videoOff]);

  useEffect(() => {
    socket.on("participant-count", (count) => {
      setParticipantCount(count);
    });
    return () => socket.off("participant-count");
  }, []);

  const showToast = (message, type = "info") => {
    setToast({ message, type, id: Date.now() });
  };

  const setLoadingState = (key, value) => {
    setLoading((prev) => ({ ...prev, [key]: value }));
  };

  const cleanup = () => {
    try {
      peerConnection.current?.close();
    } catch (err) {
      console.error("Error closing peer connection", err);
    }
    peerConnection.current = null;

    localStream?.getTracks().forEach((track) => track.stop());
    remoteStream?.getTracks().forEach((track) => track.stop());
    screenStreamRef.current?.getTracks().forEach((track) => track.stop());

    setLocalStream(null);
    setRemoteStream(null);
    screenStreamRef.current = null;

    setParticipantCount(1);
  };

  const createPeerConnection = (stream) => {
    peerConnection.current = new RTCPeerConnection(config);

    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", { roomId, candidate: event.candidate });
      }
    };

    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });
  };

  const startLocalStream = async () => {
    try {
      setLoadingState("video", true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      // Apply mute/video states after getting stream
      if (isMuted) {
        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) audioTrack.enabled = false;
      }
      if (videoOff) {
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) videoTrack.enabled = false;
      }

      setLocalStream(stream);
      return stream;
    } catch (err) {
      console.error("Media error:", err);
      if (err.name === "NotAllowedError") {
        showToast("Camera/microphone access denied", "error");
      } else if (err.name === "NotFoundError") {
        showToast("No camera/microphone found", "error");
      } else {
        showToast("Error accessing media devices", "error");
      }
      return null;
    } finally {
      setLoadingState("video", false);
    }
  };

  const createRoom = () => {
    socket.emit("create-room", (newRoomId) => {
      setRoomId(newRoomId);
      localStorage.setItem("roomId", newRoomId);
      showToast(`Room created! Share this ID: ${newRoomId}`, "success");
    });
  };

  const joinRoom = async () => {
    if (!roomId.trim()) {
      showToast("Please enter a room ID", "error");
      return;
    }
    try {
      setLoadingState("join", true);
      setConnectionStatus("connecting");

      const stream = await startLocalStream();
      if (!stream) return;

      createPeerConnection(stream);
      setInRoom(true);
      localStorage.setItem("roomId", roomId);
      socket.emit("join-room", roomId);
      showToast("Joined the room", "success");
    } catch (err) {
      console.error("Join room error:", err);
      showToast("Failed to join room", "error");
      setConnectionStatus("disconnected");
    } finally {
      setLoadingState("join", false);
    }
  };

  const leaveRoom = () => {
    if (roomId) socket.emit("leave-room", roomId);
    cleanup();
    localStorage.removeItem("roomId");
    setRoomId("");
    setInRoom(false);
    setConnectionStatus("idle");
    showToast("You left the room", "info");
  };

  const toggleMute = () => {
    const audioTrack = localStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      showToast(audioTrack.enabled ? "Microphone unmuted" : "Microphone muted", "info");
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoOff(!videoTrack.enabled);
      showToast(videoTrack.enabled ? "Camera on" : "Camera off", "info");
    }
  };

  const shareScreen = async () => {
    try {
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;

        const camTrack = localStream?.getVideoTracks()[0];
        const sender = peerConnection.current
          ?.getSenders()
          .find((s) => s.track && s.track.kind === "video");
        if (camTrack && sender) sender.replaceTrack(camTrack);

        setIsScreenSharing(false);
        showToast("Screen sharing stopped", "info");
        return;
      }

      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      screenStreamRef.current = screenStream;

      const sender = peerConnection.current
        ?.getSenders()
        .find((s) => s.track && s.track.kind === "video");
      if (sender) sender.replaceTrack(screenStream.getTracks()[0]);

      screenStream.getTracks()[0].onended = () => {
        const camTrack = localStream?.getVideoTracks()[0];
        if (camTrack && sender) sender.replaceTrack(camTrack);
        screenStreamRef.current = null;
        setIsScreenSharing(false);
        showToast("Screen sharing stopped", "info");
      };

      setIsScreenSharing(true);
      showToast("Screen sharing started", "success");
    } catch (err) {
      console.error("Screen share error:", err);
      showToast("Unable to share screen", "error");
    }
  };

  // WebRTC signaling
  useEffect(() => {
    socket.on("user-joined", () => {
      if (peerConnection.current) {
        peerConnection.current.createOffer().then((offer) => {
          peerConnection.current.setLocalDescription(offer);
          socket.emit("offer", { roomId, sdp: offer });
        });
      }
    });

    socket.on("user-left", () => {
      setRemoteStream(null);
      setParticipantCount(1);
      showToast("User left the room", "info");
    });

    socket.on("offer", async ({ sdp }) => {
      if (!peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, sdp: answer });
    });

    socket.on("answer", async ({ sdp }) => {
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(sdp));
        setConnectionStatus("connected");
      }
    });

    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding ICE candidate", err);
      }
    });

    return () => {
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
    };
  }, [roomId]);

  // Auto-rejoin room if user refreshes
  useEffect(() => {
    if (roomId && !inRoom) {
      joinRoom();
    }
  }, [roomId]);

  // Prevent leaving the room completely on refresh (only cleanup tracks)
  useEffect(() => {
    const handleUnload = () => {
      localStream?.getTracks().forEach((track) => track.stop());
      screenStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, [localStream]);

  return {
    roomId,
    setRoomId,
    inRoom,
    connectionStatus,
    isMuted,
    videoOff,
    localStream,
    remoteStream,
    loading,
    toast,
    participantCount,
    shareScreen,
    isScreenSharing,
    createRoom,
    joinRoom,
    leaveRoom,
    toggleMute,
    toggleVideo,
    showToast,
    setToast,
  };
};
