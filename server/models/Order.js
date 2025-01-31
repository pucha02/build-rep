import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    products: [{ name: String, quantity: Number, price: Number }],
    totalCost: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", OrderSchema);
