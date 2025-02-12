import mongoose from 'mongoose';

const typeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    position: { type: Number, default: null },
    visible: { type: Boolean, default: true },
});

const Type = mongoose.model('Type', typeSchema);

export default Type;