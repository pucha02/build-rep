import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true },
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
                size_name: { type: String },
                availableQuantity: { type: Number, default: 0 }
            }],
            img: [{
                img_link: { type: String }
            }]
        }
    ]
});

const Product = mongoose.model('Product', productSchema);

export default Product;