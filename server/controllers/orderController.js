import Product from '../MongooseModels/Product.js';
import { User } from '../MongooseModels/User.js';
import { Order } from '../MongooseModels/User.js';

export const registerOrder = async (req, res) => {
    const orderDetails = req.body;

    try {
        console.log(req.body);
        const user = await User.findOne({ number_phone: orderDetails.number_phone });

        const newOrder = {
            area: orderDetails.area,
            city: orderDetails.city,
            warehouse: orderDetails.warehouse,
            products: orderDetails.products.map(item => ({
                product: item.product,
                title: item.title,
                color: item.color,
                size: item.size,
                quantity: item.quantity,
                cost: item.cost,
                img: item.img,
            })),
            totalCost: orderDetails.totalCost,
            status: orderDetails.status,
            order_number: orderDetails.order_number,
            number_phone: orderDetails.number_phone,
        };

        const order = new Order(newOrder);

        if (!user) {
            // Если пользователь не найден, просто сохраняем заказ
            await order.save();
            return res.status(201).json({ message: 'Order placed successfully', order: newOrder });
        }

        // Если пользователь найден, добавляем заказ к его данным
        user.orders.push(newOrder);
        await order.save();
        await user.save();

        return res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
