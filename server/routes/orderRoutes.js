import express from "express";
import {
  getUserOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router({ mergeParams: true });

router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);
router.post("/", createOrder);
router.put("/:orderId", updateOrder);
router.delete("/:orderId", deleteOrder);

export default router;
