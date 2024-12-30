import Cart from "../MongooseModels/Cart.js";
import { User } from "../MongooseModels/User.js";
import { ObjectId } from "mongodb";

export const addToCart = async (req, res) => {
    const { userId, _id, title, cost, quantity, color, discount, originalCost, size, img, sku, id, availableQuantity, relatedProducts } = req.body;  // Извлекаем данные из запроса
    console.log("Received request to add to cart:", { userId, _id, title, cost, quantity, color, discount, originalCost, size, img });

    try {
        // Проверка наличия обязательных полей
        if (!userId || !_id || !title || !cost || !quantity) {
            return res.status(400).json({ error: 'Invalid data: userId, _id, title, cost, and quantity are required' });
        }

        // Поиск пользователя по userId
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found:", userId);
            return res.status(404).json({ error: 'User not found' });
        }

        console.log(sku)
        const existingProduct = user.cart.find(item => item._id.toString() === _id && item.size.toString() === size && item.color.toString() === color.color_name);
        console.log("Existing product in cart:", existingProduct);

        if (existingProduct) {
            console.log("Updating quantity of existing product:", existingProduct);
            const result = await User.updateOne(
                { _id: userId, 'cart._id': _id, 'cart.color': color.color_name, 'cart.size': size },
                { $inc: { 'cart.$.quantity': quantity } }
            );
            console.log("Update result:", result);
            if (result.modifiedCount > 0) {
                console.log("Product quantity successfully updated.");
            } else {
                console.log("Failed to update product quantity. Check query conditions.");
            }
        }
        else {
            console.log("Adding new product to cart:", { _id, title, cost, quantity, color: color.color_name, discount, originalCost, size, img, sku, id, availableQuantity });
            // Добавление нового товара в корзину
            await User.updateOne(
                { _id: userId },
                { $push: { cart: { _id, title, cost, quantity, color: color.color_name, discount, originalCost, size, img, sku, id, availableQuantity, relatedProducts } } }
            );
            console.log("New product added to cart");
        }

        res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error("Error occurred while adding product to cart:", error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
};


export const removeFromCart = async (req, res) => {
    const { userId, productId, item } = req.body;

    console.log("Received request to remove product from cart:", req.body);

    try {
        // Проверка обязательных данных
        if (!userId || !productId || !item.color || !item.size) {
            console.error("Invalid data: userId, productId, color, and size are required");
            return res.status(400).json({ error: 'Invalid data: userId, productId, color, and size are required' });
        }

        console.log(`Attempting to remove product variation with:
        - ID: ${productId}
        - Color: ${item.color}
        - Size: ${item.size}
        - User ID: ${userId}`);

        // Логирование текущего состояния корзины пользователя перед изменением
        const user = await User.findById(userId).select('cart');
        console.log("User's current cart:", user?.cart);

        // Удаление конкретной вариации товара
        const result = await User.updateOne(
            { _id: userId },
            {
                $pull: {
                    cart: {
                        _id: new ObjectId(productId),
                        color: item.color,
                        size: item.size // Обязательно учитывать и цвет, и размер
                    }
                }
            }
        );

        // Логирование результата обновления
        console.log("Update result:", result);

        // Логирование текущего состояния корзины пользователя после изменения
        const updatedUser = await User.findById(userId).select('cart');
        console.log("User's updated cart:", updatedUser?.cart);

        if (result.modifiedCount === 0) {
            console.warn("No matching product variation found for removal.");
            return res.status(404).json({ error: 'Product variation not found in cart' });
        }

        console.log("Specific product variation removed successfully");

        res.status(200).json({ message: 'Product variation removed from cart' });
    } catch (error) {
        console.error("Error occurred while removing product variation:", error);
        res.status(500).json({ error: 'Failed to remove product variation from cart' });
    }
};

export const updateCartQuantity = async (req, res) => {
    const { userId, productId, color, size, quantity } = req.body;

    console.log("Received request to update product quantity in cart:", req.body);

    try {
        if (!userId || !productId || !color || !size || quantity == null) {
            console.error("Invalid data: userId, productId, color, size, and quantity are required");
            return res.status(400).json({ error: 'Invalid data: userId, productId, color, size, and quantity are required' });
        }

        if (quantity < 0) {
            console.error("Quantity must be non-negative");
            return res.status(400).json({ error: 'Quantity must be non-negative' });
        }

        const user = await User.findById(userId).select('cart');
        console.log("User's current cart:", user?.cart);

        const existingProduct = user?.cart.find(item =>
            item._id.equals(new ObjectId(productId)) &&
            item.color === color &&
            item.size === size
        );

        if (!existingProduct) {
            console.warn("Product not found in cart with specified parameters");
            return res.status(404).json({ error: 'Product variation not found in cart' });
        }

        const result = await User.updateOne(
            {
                _id: userId,
                cart: {
                    $elemMatch: {
                        _id: new ObjectId(productId),
                        color: color,
                        size: size
                    }
                }
            },
            { $set: { 'cart.$.quantity': quantity } }
        );

        console.log("Using $elemMatch filter for update:", {
            _id: userId,
            cart: {
                $elemMatch: {
                    _id: new ObjectId(productId),
                    color: color,
                    size: size
                }
            }
        });

        console.log("Update result:", result);

        if (result.modifiedCount === 0) {
            console.warn("No matching product variation found to update quantity.");
            return res.status(404).json({ error: 'Product variation not found in cart' });
        }

        // Получение обновленного товара из базы данных
        const updatedUser = await User.findById(userId).select('cart');
        const updatedProduct = updatedUser?.cart.find(item =>
            item._id.equals(new ObjectId(productId)) &&
            item.color === color &&
            item.size === size
        );

        console.log("Updated product:", updatedProduct);

        if (!updatedProduct) {
            console.warn("Failed to retrieve updated product after update.");
            return res.status(500).json({ error: 'Failed to retrieve updated product' });
        }

        console.log("Product quantity updated successfully");

        res.status(200).json({
            message: 'Product quantity updated successfully',
            updatedProduct
        });
    } catch (error) {
        console.error("Error occurred while updating product quantity:", error);
        res.status(500).json({ error: 'Failed to update product quantity' });
    }
};
