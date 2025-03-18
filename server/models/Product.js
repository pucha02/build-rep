import mongoose from 'mongoose';
import Settings from './Settings.js'; // Убедитесь, что путь корректный

const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  category: { type: String },
  categoryLink: { type: String },
  subcategory: { type: String },
  subcategoryLink: { type: String },
  type: { type: String },
  brand: { type: String },
  imageURL: { type: [String], default: [] },
  description: { type: String, default: null },
  features: { type: Array, default: [] },
  application: { type: Array, default: [] },
  costEUR: { type: Number },
  costUAH: { type: Number },
  cost: { type: Number },
  sku: { type: String },
  quantity: { type: Number },
  discount: { type: Number, default: 0 }
});

// При сохранении товара пересчитываем costUAH, используя курс из базы
productSchema.pre('save', async function(next) {
  if (this.isModified('costEUR') || this.isNew) {
    try {
      const setting = await Settings.findOne({ key: "exchangeRate" });
      const exchangeRate = setting ? setting.value : 30; // Если настройка не найдена, использовать 30
      this.costUAH = this.costEUR * exchangeRate;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Product = mongoose.model('Product', productSchema);
export default Product;
