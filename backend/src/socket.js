const { Server } = require("socket.io");

let io;

// Map userId -> socketId để emit trực tiếp cho từng user
const userSocketMap = {};

const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // Client gửi userId khi đăng nhập để map vào socket
        socket.on("register", (userId) => {
            if (userId) {
                userSocketMap[userId] = socket.id;
                console.log(`📌 User ${userId} registered with socket ${socket.id}`);
            }
        });

        socket.on("disconnect", () => {
            // Xóa user khỏi map khi disconnect
            for (const [userId, socketId] of Object.entries(userSocketMap)) {
                if (socketId === socket.id) {
                    delete userSocketMap[userId];
                    console.log(`🔌 User ${userId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
};

const getIo = () => {
    if (!io) throw new Error("Socket.IO chưa được khởi tạo!");
    return io;
};

const getUserSocketMap = () => userSocketMap;

module.exports = { initSocket, getIo, getUserSocketMap };
