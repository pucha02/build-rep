import {User} from "../models/User.js";

// Получить все заказы для пользователя
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Получить конкретный заказ пользователя
export const getOrderById = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const order = user.orders.id(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Создать новый заказ для пользователя
export const createOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    // Добавляем новый заказ в массив orders
    user.orders.push(req.body);
    await user.save();
    // Возвращаем только что созданный заказ
    const newOrder = user.orders[user.orders.length - 1];
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Обновить заказ пользователя
export const updateOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const order = user.orders.id(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    // Обновляем поля заказа (order.set обновляет только указанные поля)
    order.set(req.body);
    await user.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Удалить заказ пользователя
export const deleteOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    const order = user.orders.id(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.remove();
    await user.save();
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
