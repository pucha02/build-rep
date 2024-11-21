import mongoose from 'mongoose';

const priceSchema = new mongoose.Schema({
    deliveryPrice: { type: Number }
});

const DeliveryPrice = mongoose.model('DeliveryPrice', priceSchema);

export default DeliveryPrice;
