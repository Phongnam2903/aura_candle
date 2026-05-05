const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
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

//  Middleware để log mọi request (giúp debug)
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

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
const paymentRouter = require("./src/routes/PaymentRoutes");
const blogRouter = require("./src/routes/BlogRoutes");

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
app.use("/payment", paymentRouter);
app.use("/blog", blogRouter);


// Test route để kiểm tra server hoạt động
app.get("/", (req, res) => {
  res.json({
    message: "Aura Candle API is running",
    routes: ["/product", "/category", "/material", "/auth", "/upload", "/cart", "/order", "/orderSeller", "/addresses", "/chat", "/notification", "/comments", "/dashboard", "/payment", "/blog"]
  });
});

// 404 handler - đặt sau tất cả routes
app.use((req, res) => {
  console.log(` 404 Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Route not found", path: req.url });
});

// Chạy server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
  console.log(`SECRET_KEY: ${process.env.SECRET_KEY ? "Loaded OK" : "Not found"}`);
});
