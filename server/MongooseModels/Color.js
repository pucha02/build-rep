import mongoose from 'mongoose';

const ColorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    color: { type: String, required: true },
});

const Color = mongoose.model('Color', ColorSchema);

export default Color;