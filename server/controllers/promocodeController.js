import PromoCode from '../MongooseModels/PromoCode.js';

export const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.status(200).json(promoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении промокодов', error });
    }
};

export const getPromoCodeById = async (req, res) => {
    try {
        const promoCode = await PromoCode.findById(req.params.id);
        if (!promoCode) {
            return res.status(404).json({ message: 'Промокод не найден' });
        }
        res.status(200).json(promoCode);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении промокода', error });
    }
};

export const createPromoCode = async (req, res) => {
    try {
        const newPromoCode = new PromoCode(req.body);
        await newPromoCode.save();
        res.status(201).json(newPromoCode);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при создании промокода', error });
    }
};

export const updatePromoCode = async (req, res) => {
    try {
        const updatedPromoCode = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPromoCode) {
            return res.status(404).json({ message: 'Промокод не найден' });
        }
        res.status(200).json(updatedPromoCode);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при обновлении промокода', error });
    }
};

export const deletePromoCode = async (req, res) => {
    try {
        const deletedPromoCode = await PromoCode.findByIdAndDelete(req.params.id);
        if (!deletedPromoCode) {
            return res.status(404).json({ message: 'Промокод не найден' });
        }
        res.status(200).json({ message: 'Промокод удалён' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении промокода', error });
    }
};