import amqp from "amqplib";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const processOrder = async (msg) => {
    const orderData = JSON.parse(msg.content.toString());
    console.log("📦 Processing order:", orderData);

    const order = await Order.findById(orderData._id);
    if (order) {
        order.status = "Processed";
        await order.save();
        console.log("✅ Order processed successfully");
    }
};

const startWorker = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue("orders");
    channel.consume("orders", processOrder, { noAck: true });
    console.log("👷 Worker started and waiting for messages...");
};

startWorker();
