import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    category: { type: String },
    categoryLink: { type: String },
    subcategory: { type: String },
    subcategoryLink: { type: String },
    type:{ type: String },
    brand: { type: String },
    imageURL:{ type: [String], default: [] },
    description: { type: String, default: null },
    cost: { type: Number },
    sku: { type: String, required: false },
    quantity: { type: Number },
    discount: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);

export default Product;