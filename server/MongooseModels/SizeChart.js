import mongoose from 'mongoose';

const sizeChartSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Название таблицы (например, "Таблица верхней одежды")
  columns: [{ type: String, required: true }], // Названия столбцов
  rows: [
    {
      data: { type: Map, of: String }, // Данные строки (ключ: название столбца, значение: данные)
    },
  ],
});

const SizeChart = mongoose.model('SizeChart', sizeChartSchema);

export default SizeChart;
