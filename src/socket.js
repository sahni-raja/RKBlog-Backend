import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); 

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://rk-blog-frontend.vercel.app"
      ],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("🔌 Socket connected:", socket.id);

    // frontend will send userId after login
    socket.on("register", (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log("👤 User online:", userId);
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log("❌ User offline:", userId);
        }
      }
    });
  });
};

export const emitNotification = (userId, notification) => {
  const socketId = onlineUsers.get(userId.toString());
  if (socketId && io) {
    io.to(socketId).emit("notification", notification);
  }
};
