import SizeChart from "../MongooseModels/SizeChart.js";
import mongoose from "mongoose";

export const getSizeChart = async (req, res) => {
    const { id } = req.params;
    try {
        // Проверка валидности ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Недопустимый ID таблицы размеров' });
        }

        // Поиск таблицы размеров
        const sizeChart = await SizeChart.findById(id);

        if (!sizeChart) {
            return res.status(404).json({ error: 'Таблица размеров не найдена' });
        }
        console.log(sizeChart)

        res.json(sizeChart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сервера при получении таблицы размеров' });
    }
}