import PromoCode from '../MongooseModels/PromoCode.js';
import UsedPromoCode from '../MongooseModels/CheckedPromoCode.js';

export const getAllPromoCodes = async (req, res) => {
    try {
        const promoCodes = await PromoCode.find();
        res.status(200).json(promoCodes);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении промокодов', error });
    }
};

export const getPromoCodeByCode = async (req, res) => {
    const { code } = req.query;
    try {
        const promoCode = await PromoCode.findOne({ "code": code });
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

export const checkPromoCode = async (req, res) => {
    const { deviceId, promoCodeTitle } = req.body;
    console.log(req.body)
    // if (!deviceId || !promoCodeTitle) {
    //   return res.status(400).json({ message: 'deviceId и promoCodeTitle обязательны' });
    // }
  
    try {
      // Проверяем, был ли уже использован этот промокод
      const existing = await UsedPromoCode.findOne({ deviceId, promoCode: promoCodeTitle });
      if (existing) {
        return res.json({ isUsed: true, message: 'Ви вже використали цей промокод' });
      }
      console.log(existing)
      // Проверяем действительность промокода (эмулируем логику)
      const promoCode = await PromoCode.findOne({ "code": promoCodeTitle }); // Замени на свою логику
      if (!promoCode) {
        return res.status(404).json({ message: 'Промокод недійсний' });
      }
  
      // Сохраняем применение промокода
      const newEntry = new UsedPromoCode({ deviceId, promoCode: promoCodeTitle });
      await newEntry.save();
  
      return res.json({ isUsed: false, discountPercentage: promoCode.discountPercentage });
    } catch (error) {
      console.error('Ошибка при обработке промокода:', error);
      res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
  };


  export const checkLastPromoCode = async (req, res) => {
    const { deviceId, promoCodeTitle } = req.body;
    console.log(req.body)
  
    try {
      // Проверяем, был ли уже использован этот промокод
      const existing = await UsedPromoCode.findOne({ deviceId, promoCode: promoCodeTitle });
      if (existing) {
        return res.json({ isUsed: true, message: 'Ви вже використали цей промокод' });
      }
      console.log(existing)
      const promoCode = await PromoCode.findOne({ "code": promoCodeTitle }); // Замени на свою логику
      if (!promoCode) {
        return res.status(404).json({ message: 'Промокод недійсний' });
      }

  
      return res.json({ isUsed: false, discountPercentage: promoCode.discountPercentage });
    } catch (error) {
      console.error('Ошибка при обработке промокода:', error);
      res.status(500).json({ message: 'Внутрішня помилка сервера' });
    }
  };