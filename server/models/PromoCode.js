import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discountPercentage: { type: String, required: true },
    startDate: { type: Date},
    endDate: { type: Date}
});

const PromoCode = mongoose.model('PromoCode', promoCodeSchema);

export default PromoCode;