// server/socket/rooms.js
const rooms = new Map();

function createRoom(roomId) {
  rooms.set(roomId, { id: roomId, createdAt: new Date(), participants: [] });
}

function deleteRoom(roomId) {
  rooms.delete(roomId);
}

function getRoom(roomId) {
  return rooms.get(roomId);
}

function addParticipant(roomId, socketId) {
  const room = rooms.get(roomId);
  if (room) {
    room.participants.push(socketId);
  }
}

function removeParticipant(roomId, socketId) {
  const room = rooms.get(roomId);
  if (room) {
    room.participants = room.participants.filter(id => id !== socketId);
    if (room.participants.length === 0) deleteRoom(roomId);
  }
}

function cleanupOldRooms() {
  const now = new Date();
  for (const [roomId, room] of rooms.entries()) {
    const age = now - room.createdAt;
    if (age > 24 * 60 * 60 * 1000 && room.participants.length === 0) {
      deleteRoom(roomId);
      console.log(`Cleaned up old room: ${roomId}`);
    }
  }
}

export {
  rooms,
  createRoom,
  deleteRoom,
  getRoom,
  addParticipant,
  removeParticipant,
  cleanupOldRooms
};
