import express from "express";
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

// Получить список всех категорий
router.get("/", getAllCategories);

// Получить категорию по _id
router.get("/:id", getCategoryById);

// Создать новую категорию
router.post("/", createCategory);

// Обновить категорию по _id
router.put("/:id", updateCategory);

// Удалить категорию по _id
router.delete("/:id", deleteCategory);

export default router;
