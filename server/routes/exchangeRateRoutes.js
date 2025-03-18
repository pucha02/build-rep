import express from "express";
import Product from "../models/Product.js";
import Settings from "../models/Settings.js";

const router = express.Router();

// GET /api/settings/exchange-rate
// Возвращает текущий курс валют
router.get("/exchange-rate", async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: "exchangeRate" });
    if (!setting) {
      return res.status(404).json({ message: "Exchange rate not found" });
    }
    res.json({ exchangeRate: setting.value });
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/settings/exchange-rate
// Обновляет курс валют и пересчитывает цены товаров (costUAH = costEUR * newExchangeRate)
router.put("/exchange-rate", async (req, res) => {
  try {
    const { newExchangeRate } = req.body;
    if (!newExchangeRate || typeof newExchangeRate !== "number") {
      return res.status(400).json({ message: "Invalid exchange rate" });
    }
    
    // Обновляем или создаём настройку с курсом валют
    const setting = await Settings.findOneAndUpdate(
      { key: "exchangeRate" },
      { value: newExchangeRate },
      { new: true, upsert: true }
    );
    
    // Bulk-обновление: пересчитываем costUAH для всех товаров
    const result = await Product.updateMany(
      {},
      [
        { $set: { costUAH: { $multiply: ["$costEUR", newExchangeRate] } } }
      ]
    );
    
    res.status(200).json({
      message: "Exchange rate updated and product prices recalculated",
      exchangeRate: setting.value,
      result,
    });
  } catch (error) {
    console.error("Error updating exchange rate:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
