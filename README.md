# Real-Time Two-Way Video Streaming Web App (WebRTC)

This project is a **real-time two-way live video streaming web application** built using **WebRTC, Socket.IO, and React (Vite)**.  
It allows multiple users to **join a shared room via a unique Room ID**, **stream video/audio peer-to-peer**, and even **share their screen** during the call.

---

## Features

- **Room Creation & Management**
  - Users can create rooms with **unique Room IDs**.
  - Other users can join using the Room ID.
  - Automatically **notifies all participants** when someone joins or leaves.

- **Two-Way Video & Audio Streaming**
  - **Peer-to-peer (P2P)** video and audio via WebRTC.
  - Low-latency connections with **direct media streams**.

- **Screen Sharing**
  - Participants can **share their screen** in real time for presentations or collaboration.

- **Signaling Server**
  - Real-time signaling powered by **Socket.IO** (Node.js backend).
  - Handles room joins, SDP offers/answers, and ICE candidate exchanges.

- **UI/UX Features**
  - Clean and responsive video layout.
  - Controls for:
    - **Mute/Unmute microphone**
    - **Toggle camera**
    - **Screen sharing**
    - **Leave meeting**
  - Displays **participant count**.
  - **Toast notifications** for joins, leaves, and errors.

- **Environment Support**
  - Separate configurations for **development** and **production** via `.env` files.
  - Ready to deploy on **Render (backend)** and **Vercel (frontend)**.

---

## Project Structure

```plaintext
webrtc-app/
│
├── server/                          # Node.js + Express + Socket.IO backend
│   ├── server.js                    # Entry point (Express server & Socket.IO)
│   ├── socket/
│   │   ├── index.js                 # Socket.IO initialization
│   │   ├── handlers.js              # Socket event handlers (join, leave, offer/answer)
│   │   └── rooms.js                 # Room management (create/join/leave)
│   ├── utils/
│   │   └── generateRoomId.js        # Utility for generating unique room IDs
│   ├── config/
│   │   └── cors.js                  # CORS configuration
│   ├── package.json
│   ├── .env.development
│   └── .env.production
│
├── client/                          # React (Vite) frontend
│   ├── dist/                        # Build output (after `npm run build`)
│   ├── src/
│   │   ├── components/
│   │   │   ├── VideoPlayer.jsx      # Renders local and remote video
│   │   │   ├── ControlsToolbar.jsx  # Mic, camera, screen sharing, leave controls
│   │   │   ├── InviteBox.jsx        # Displays room ID for sharing
│   │   │   ├── useWebRTC.js         # Core WebRTC logic (peer connections)
│   │   │   ├── VideoChat.jsx        # Main video chat container
│   │   │   ├── Toast.jsx            # Toast notifications
│   │   │   ├── LoadingSpinner.jsx   # Loading animation
│   │   │   ├── ControlButton.jsx    # Reusable button for controls
│   │   │   └── ConnectionStatus.jsx # Shows connection quality/status
│   │   ├── App.jsx                  # Root component
│   │   ├── App.css                  # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── .env.development
│   └── .env.production
│

````

---

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/its-AkshatJain/Scrum-App.git
cd Scrum-App
```

2. **Install dependencies**

For the backend:

```bash
cd server
npm install
```

For the frontend:

```bash
cd ../client
npm install
```

3. **Set environment variables**

Backend (`server/.env.development`):

```
PORT=5000
CLIENT_URL=http://localhost:5173
```

Frontend (`client/.env.development`):

```
VITE_SOCKET_URL=http://localhost:5000
```

4. **Run locally**

Backend:

```bash
cd server
node server.js
```

Frontend:

```bash
cd client
npm run dev
```

Open the app in your browser: [http://localhost:5173](http://localhost:5173)

---

## Deployment

* **Frontend**: Hosted on [Vercel](https://scrum-app-five.vercel.app/)
* **Backend**: Hosted on [Render](https://scrum-app-backend.onrender.com)

Set the **`VITE_SOCKET_URL`** in your **frontend `.env.production`** file:
---

## Tech Stack

* **Frontend**: React (Vite) + WebRTC API
* **Backend**: Node.js + Express + Socket.IO
* **Deployment**: Vercel (frontend) & Render (backend)

---
