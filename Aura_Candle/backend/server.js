const express = require("express");
const path = require("path");
require("dotenv").config();
const connectDB = require("./src/config/db");

const cors = require("cors");
const productRouter = require("./src/routes/ProductRoutes");
const materialRouter = require("./src/routes/MaterialRoutes");
const authRouter = require("./src/routes/UserRoutes");
const categoryRouter = require("./src/routes/CategoryRoutes")
const uploadRouter = require("./src/routes/uploadRoutes");
const cartRouter = require("./src/routes/CartRoutes");
const orderRouter = require("./src/routes/OrderRoutes");
const addressRouter = require("./src/routes/AddressRoutes");

connectDB();
const app = express();

// Middleware parse JSON
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Cho phép truy cập thư mục uploads công khai
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// API routes
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/material", materialRouter);
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);
app.use("/cart", cartRouter)
app.use("/order", orderRouter);
app.use("/addresses", addressRouter)

// Start server
const port = process.env.PORT || 5000;
const host = process.env.HOSTNAME || "localhost";
app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
