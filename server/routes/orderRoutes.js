import express from "express";
import Order from "../models/Order.js";
import { sendToQueue } from "../config/rabbit.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { products, totalCost } = req.body;
        const order = new Order({ products, totalCost });
        await order.save();

        sendToQueue("orders", order);

        res.json({ message: "Order created and sent to processing queue" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
