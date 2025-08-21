const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { JWT_ACCESS_SECRET_KEY } = require("../config/config");
const { sendMessage } = require("../services/messageService");
const MessageModel = require("../models/messageModel");

let io;

const initSocket = (server, CLIENT_URL) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: CLIENT_URL,
      credentials: true,
    },
    path: "/realtime",
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  // ✅ JWT authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error("Authentication error"));

    jwt.verify(token, JWT_ACCESS_SECRET_KEY, (err, decoded) => {
      if (err) return next(new Error("Authentication error"));
      socket.user = decoded; // attach decoded user to socket
      next();
    });
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id, "user:", socket.user.id);

    // Join a chat room
    socket.on("joinGroup", ({ chatId }) => {
      socket.join(chatId);
      console.log(`${socket.id} joined ${chatId}`);
    });

    // Socket sendMessage handler
    socket.on("sendMessage", async ({ chatId, authorId, text, clientId, files }) => {
      try {
        // Prevent duplicate messages by clientId
        if (clientId) {
          const exists = await MessageModel.findOne({ clientId });
          if (exists) return;
        }

        // Create new message
        const msg = await MessageModel.create({
          chat: chatId,
          author: authorId,
          body: {
            text: text,
            imageUrl: files?.imageUrl || null,
            fileUrl: files?.fileUrl || null,
            fileName: files?.fileName || null,
            audioUrl: files?.audioUrl || null,
          },
          clientId: clientId,
        });

        // Populate author username
        await msg.populate("author", "username");

        // Broadcast to all clients in the chat
        io.to(chatId).emit("newMessage", {
          id: msg._id.toString(),
          author: {
            id: msg.author._id.toString(),
            username: msg.author.username,
          },
          body: {
            text: msg.body.text,
            imageUrl: msg.body.imageUrl,
            fileUrl: msg.body.fileUrl,
            fileName: msg.body.fileName,
            audioUrl: msg.body.audioUrl,
          },
          clientId: msg.clientId,
          deliveredTo: msg.deliveredTo || [],
          readBy: msg.readBy || [],
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
        });

      } catch (err) {
        console.error("sendMessage error", err.message);
        socket.emit("error", { message: "Failed to send message" });
      }
    });



    // Typing indicator
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", userId);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initSocket, getIO };
