import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    
    title: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String },
    description: { type: String, default: null },
    cost: { type: String },
    quantity: { type: Number },
    discount: {
        percentage: { type: Number, default: 0 },
        startDate: { type: Date },
        endDate: { type: Date }
    },
    color: [
        {
            color_name: { type: String },
            sizes: [{
                id: { type: Number },
                size_name: { type: String },
                availableQuantity: { type: Number, default: 0 },
                sku: { type: String }
            }],
            img: [{
                img_link: { type: String }
            }]
        }
    ],
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Product = mongoose.model('Product', productSchema);

export default Product;