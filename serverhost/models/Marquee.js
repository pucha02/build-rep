import mongoose from 'mongoose';

const marqueeSchema = new mongoose.Schema({
    content: { type: String }
});

const Marquee = mongoose.model('Marquee', marqueeSchema);

export default Marquee;
