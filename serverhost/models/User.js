import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    number_phone: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    companyname: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

export default User;
