const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config(); // ✅ Đọc file .env ngay đầu tiên
const connectDB = require("./src/config/db");

//  Kiểm tra SECRET_KEY có đọc được không
if (!process.env.SECRET_KEY) {
  console.error("❌ Lỗi: SECRET_KEY không được định nghĩa trong file .env");
  process.exit(1); // Dừng server để tránh lỗi jwt.sign
}

//  Kết nối database
connectDB();

const app = express();

//  Middleware parse JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

//  Cho phép CORS
app.use(cors({ origin: "*" }));

//  Public folder cho uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Import routes
const productRouter = require("./src/routes/ProductRoutes");
const materialRouter = require("./src/routes/MaterialRoutes");
const authRouter = require("./src/routes/UserRoutes");
const categoryRouter = require("./src/routes/CategoryRoutes");
const uploadRouter = require("./src/routes/uploadRoutes");
const cartRouter = require("./src/routes/CartRoutes");
const orderRouter = require("./src/routes/OrderRoutes");
const addressRouter = require("./src/routes/AddressRoutes");
const orderSellerRouter = require("./src/routes/OrderSellerRoutes");
const chatBotRouter = require("./src/routes/ChatRoutes");
const notificationRouter = require("./src/routes/NotificationRoutes.js");
const commentRouter = require("./src/routes/CommentRoutes.js");
const dashboardRouter = require("./src/routes/DashboardRoutes.js");

// Đăng ký routes
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/material", materialRouter);
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/orderSeller", orderSellerRouter);
app.use("/addresses", addressRouter);
app.use("/chat", chatBotRouter);
app.use("/notification", notificationRouter);
app.use("/comments", commentRouter);
app.use("/dashboard", dashboardRouter);

// Chạy server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${port}`);
  console.log(`🔑 SECRET_KEY: ${process.env.SECRET_KEY ? "Loaded OK" : "Not found"}`);
});
