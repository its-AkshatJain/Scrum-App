// frontend/src/components/InviteBox.js
export default function InviteBox({ roomId }) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied to clipboard!");
  };

  return (
    <div className="mt-2 text-sm flex items-center gap-2">
      <span>Invite Code: <strong>{roomId}</strong></span>
      <button
        onClick={copyToClipboard}
        className="p-1 px-2 bg-blue-500 text-white rounded text-xs"
      >
        Copy
      </button>
    </div>
  );
}
