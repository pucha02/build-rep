import mongoose from "mongoose";

const usedPromoCodeSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  promoCode: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
});
const UsedPromoCode = mongoose.model('UsedPromoCode', usedPromoCodeSchema);

export default UsedPromoCode; 