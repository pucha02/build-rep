import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
    minPrice: { type: String }
});

const MinPrice = mongoose.model('MinPrice', priceSchema);

export default MinPrice;
