import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    client_name: { type: String, required: true },
    phone: { type: String, required: true },
    comment: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

const Message = mongoose.model('Message', messageSchema);

export default Message;