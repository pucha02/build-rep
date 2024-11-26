import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true, // Это поле обязательно
    },
    bannerImagePath: {
        type: String,
        default: '', // По умолчанию пустая строка, если баннер не загружен
    },
}, {
    timestamps: true, // Для добавления полей createdAt и updatedAt
});

const BannerModel = mongoose.model('Banner', BannerSchema);

export default BannerModel;
