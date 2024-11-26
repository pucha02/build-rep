import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String },
    description: { type: String },
    basePrice: { type: String },
    category: { type: String },
    subCategory: { type: String },
    coverImage: { type: String },
    type: { type: String },
    categoryOrder: { type: Number, default: 0 }, // Порядок категории
    productOrder: { type: Number, default: 0 }  // Порядок товара в категории
});

const Product = mongoose.model('Product', productSchema);

export default Product;
