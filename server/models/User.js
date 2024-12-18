import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    address: { type: String, required: true },
    graphqlId: { type: String, required: false }
});

const userSchema = new mongoose.Schema({
    number_phone: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    password: { type: String, required: true },
    companyname: { type: String, required: true },
    city: { type: String, required: true },
    addresses: { type: [addressSchema], required: true, default: [] },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
