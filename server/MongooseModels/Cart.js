import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    cart: {type: Array} 
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;