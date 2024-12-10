import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    title: { type: String },
    color: { type: String },
    size: { type: String },
    quantity: { type: Number, default: 1 },
    cost: { type: Number },
    discount: { type: Number },
    originalCost: { type: Number },
    img: { type: String }
});

const orderSchema = new mongoose.Schema({
    area: { type: String },
    city: { type: String },
    warehouse: { type: String },
    products: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            title: { type: String },
            color: { type: String },
            size: { type: String },
            quantity: { type: Number },
            cost: { type: Number },
            img: { type: String }
        }
    ],
    totalCost: { type: Number, required: true },
    status: { type: String },
    order_number: { type: String },
    number_phone: { type: String }
});

const userSchema = new mongoose.Schema({
    number_phone: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String },
    password: { type: String, required: true },
    cart: [cartItemSchema],
    orders: [orderSchema],
    deliveryInfo: {
        area: String,
        city: String,
        warehouse: String,
    },
    promoCodes: [
        {
            code: { type: String }, // Код промокода
            activatedAt: { type: Date, default: Date.now }, // Дата активации
            isUsed: { type: Boolean, default: false }, // Статус использования
        }
    ]
});

export const User = mongoose.model('User', userSchema);
export const Order = mongoose.model('Order', orderSchema)
