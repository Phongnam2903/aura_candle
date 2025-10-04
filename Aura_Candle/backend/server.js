const express = require("express");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./src/config/db");

// Import routes
const productRouter = require("./src/routes/ProductRoutes");
const materialRouter = require("./src/routes/MaterialRoutes");
const authRouter = require("./src/routes/UserRoutes");
const categoryRouter = require("./src/routes/CategoryRoutes");
const uploadRouter = require("./src/routes/uploadRoutes");
const cartRouter = require("./src/routes/CartRoutes");
const orderRouter = require("./src/routes/OrderRoutes");
const addressRouter = require("./src/routes/AddressRoutes");
const orderSellerRouter = require("./src/routes/OrderSellerRoutes");
const chatRouter = require("./src/routes/ChatRoutes");

// Kết nối database
connectDB();

const app = express();

// Middleware parse JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Public folder cho uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  CORS (chỉ cần cho phép domain frontend, không cần credentials)
app.use(
  cors({
    origin: [
      "http://localhost:3000",        // khi chạy local dev
      "https://aura-candle.vercel.app" // domain deploy thật trên Vercel
    ]
  })
);

// API routes
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/material", materialRouter);
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/orderSeller", orderSellerRouter);
app.use("/addresses", addressRouter);
app.use("/chat", chatRouter);

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
