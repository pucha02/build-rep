import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { connectRabbitMQ } from "./config/rabbit.js";
import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();
connectDB();
connectRabbitMQ();

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
