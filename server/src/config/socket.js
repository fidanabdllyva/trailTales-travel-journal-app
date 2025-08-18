const { Server } = require("socket.io");

let io; // will hold the Socket.IO instance

/**
 * Initialize Socket.IO server
 * @param {http.Server} server - HTTP server instance
 * @param {string} CLIENT_URL - allowed origin
 * @returns {Server} io instance
 */
const initSocket = (server, CLIENT_URL) => {
  if (io) return io; // prevent multiple initializations

  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      credentials: true,
    },
    path: "/realtime",       // custom path to avoid default /socket.io
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    // Example chat event
    socket.on("chatMessage", (msg) => {
      console.log("Message received:", msg);
      io.emit("chatMessage", msg); // broadcast to all clients
    });
  });

  return io;
};

/**
 * Get initialized Socket.IO instance
 * @returns {Server} io instance
 */
const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };
