import io, { Socket } from "socket.io-client";
import { API_BASE_URL } from "@/api/constants";

let socket: Socket | null = null;

// ---------------- SOCKET FUNCTIONS ----------------
export function connectSocket(userId: string) {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  console.log("🚀 connectSocket token:", token);

  if (!socket) {
    socket = io(API_BASE_URL || "", {
      path: "/realtime",
      withCredentials: true,
      transports: ["websocket"],
      reconnection: true,
     auth: { token, userId },

    });

    socket.on("connect", () => console.log("✅ Socket connected:", socket?.id));
    socket.on("connect_error", (err) => console.error("❌ Socket connection error:", err.message));
    socket.on("disconnect", (reason) => console.warn("⚠️ Socket disconnected:", reason));
  }

  return socket;
}

export function joinGroup(chatId: string) {
  if (!socket) return;
  console.log("🔹 joinGroup called:", chatId);
  socket.emit("joinGroup", { chatId });
}

export function onNewMessage(cb: (msg: any) => void) {
  if (!socket) return;
  console.log("🔹 onNewMessage listener attached");

  socket.off("newMessage");
  socket.on("newMessage", cb);
}

export function sendSocketMessage(data: {
  chatId: string;
  authorId: string;
  text?: string;
  clientId?: string;
  files?: { type: string; name: string; data: string }[];
}) {
  if (!socket) return;
  console.log("🔹 sendSocketMessage:", data);
  socket.emit("sendMessage", data);
}


export function disconnectSocket() {
  if (!socket) return;
  console.log("🔹 disconnectSocket called");

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}

// ---------------- REST API ----------------
import instance from "@/api/instance";

export const enableChatForList = async (listId: string) => {
  try {
    const res = await instance.post(`/chat/lists/${listId}/enable-chat`);
    console.log("✅ enableChatForList response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error(`❌ Failed to enable chat for list ${listId}:`, error.response?.data || error.message);
    throw error;
  }
};

export const fetchMessages = async (chatId: string, cursor?: string) => {
  try {
    console.log("🔹 fetchMessages called for group:", chatId, "cursor:", cursor);
    const res = await instance.get(`/message/groups/messages`, {
      params: { chatId, cursor },
    });
    console.log("✅ fetchMessages response:", res.data);
    return res.data;
  } catch (error: any) {
    console.error(`❌ Failed to fetch messages for group ${chatId}:`, error.response?.data || error.message);
    throw error;
  }
};
