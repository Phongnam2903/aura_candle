const express = require("express");
require("dotenv").config();
const connectDB = require("./src/config/db");

connectDB();
const app = express();

// ⚠️ Cấu hình JSON và URL-encoded phải đúng thứ tự, không lặp lại!
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


// API routes
const productRouter = require("./src/routes/ProductRoutes");
const materialRouter = require("./src/routes/MaterialRoutes");
const authRouter = require("./src/routes/UserRoutes");



app.use("/product", productRouter);
app.use("/material", materialRouter);
app.use("/auth", authRouter);


// Start server
const port = process.env.PORT;
const host = process.env.HOSTNAME;
app.listen(port, host, () => {
  console.log(`Server is running at http://${host}:${port}`);
});
