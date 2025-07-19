import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
const socket = io(SOCKET_URL);

export function useWebRTC() {
  const [roomId, setRoomId] = useState(() => localStorage.getItem("roomId") || "");
  const [inRoom, setInRoom] = useState(false);
  const [message, setMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const peerConnection = useRef(null);
  const screenStream = useRef(null);

  const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

  const cleanup = () => {
    try {
      peerConnection.current?.close();
    } catch (err) {
      console.error("Error closing peer connection", err);
    }
    localStream?.getTracks().forEach((t) => t.stop());
    screenStream.current?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
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
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      return stream;
    } catch (err) {
      setMessage("Error accessing camera/microphone.");
      console.error("Media error:", err);
      return null;
    }
  };

  const createRoom = () => {
    socket.emit("create-room", (newRoomId) => {
      setRoomId(newRoomId);
      localStorage.setItem("roomId", newRoomId);
      setMessage(`Room created! Share this ID: ${newRoomId}`);
    });
  };

  const joinRoom = async () => {
    if (!roomId) {
      setMessage("Enter a room ID first.");
      return;
    }

    const stream = await startLocalStream();
    if (!stream) return;

    setInRoom(true);
    setMessage("Joining room...");
    localStorage.setItem("roomId", roomId);

    createPeerConnection(stream);
    socket.emit("join-room", roomId);
  };

  const leaveRoom = () => {
    if (roomId) socket.emit("leave-room", roomId);
    cleanup();
    localStorage.removeItem("roomId");
    setRoomId("");
    setInRoom(false);
    setMessage("You left the room.");
  };

  const toggleMute = () => {
    const audioTrack = localStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setVideoOff(!videoTrack.enabled);
    }
  };

  const shareScreen = async () => {
    try {
      screenStream.current = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = screenStream.current.getTracks()[0];
      const sender = peerConnection.current
        .getSenders()
        .find((s) => s.track && s.track.kind === "video");

      if (sender) sender.replaceTrack(screenTrack);

      screenTrack.onended = () => {
        const camTrack = localStream?.getVideoTracks()[0];
        if (camTrack && sender) sender.replaceTrack(camTrack);
      };
    } catch (err) {
      setMessage("Error sharing screen.");
      console.error("Screen share error:", err);
    }
  };

  // Handle socket events
  useEffect(() => {
    socket.on("user-joined", () => {
      setMessage("Another user joined! Connecting...");
      if (peerConnection.current) {
        peerConnection.current.createOffer().then((offer) => {
          peerConnection.current.setLocalDescription(offer);
          socket.emit("offer", { roomId, sdp: offer });
        });
      }
    });

    socket.on("user-left", () => {
      setMessage("User left the room.");
      setRemoteStream(null);
    });

    socket.on("offer", async (data) => {
      setMessage("Received offer, sending answer...");
      if (!peerConnection.current) return;
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, sdp: answer });
    });

    socket.on("answer", async (data) => {
      setMessage("Connected!");
      if (peerConnection.current) {
        await peerConnection.current.setRemoteDescription(new RTCSessionDescription(data.sdp));
      }
    });

    socket.on("ice-candidate", async (data) => {
      try {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
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

  // Cleanup on page unload
  useEffect(() => {
    const handleUnload = () => leaveRoom();
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  // Auto-rejoin if a room exists (refresh)
  useEffect(() => {
    if (roomId && !inRoom) joinRoom();
  }, []);

  return {
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
  };
}
