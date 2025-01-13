import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: null },
});

const Size = mongoose.model('Size', sizeSchema);

export default Size;
