import Product from '../MongooseModels/Product.js';
import { User } from '../MongooseModels/User.js';
import { Order } from '../MongooseModels/User.js';

const apiUrl = "https://crm.sitniks.com/open-api/orders";
const token = "nGB8rpzNAT1nOAuSQqyV1nXBBmwGgXTTNHSYW8hjF17";

export const registerOrder = async (req, res) => {
    const orderDetails = req.body;

    try {
        console.log("[DEBUG] Отримані дані замовлення:", JSON.stringify(orderDetails, null, 2));

        const user = await User.findOne({ number_phone: orderDetails.number_phone });
        if (!user) {
            console.log("[DEBUG] Користувач не знайдений. Створюємо нового користувача.");
        }

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
                sku: item.sku,
                id: item.id
            })),
            totalCost: orderDetails.totalCost,
            status: orderDetails.status,
            order_number: orderDetails.order_number,
            number_phone: orderDetails.number_phone,
        };

        console.log("[DEBUG] Створене нове замовлення:", JSON.stringify(newOrder, null, 2));

        const order = new Order(newOrder);

        for (const item of orderDetails.products) {
            console.log(`[DEBUG] Перевірка товару: ${item.title}, колір: ${item.color}, розмір: ${item.size}`);

            const product = await Product.findOne({ title: item.title });
            if (!product) {
                console.error(`[ERROR] Товар з назвою ${item.title} не знайдений.`);
                return res.status(404).json({ message: `Товар з назвою ${item.title} не знайдений` });
            }

            const color = product.color.find(c => c.color_name === (item.color.color_name || item.color));
            if (!color) {
                console.error(`[ERROR] Колір ${item.color} не знайдений у товарі ${item.title}.`);
                return res.status(404).json({ message: `Колір ${item.color} не знайдений у товарі ${item.title}` });
            }

            const size = color.sizes.find(s => s.size_name === item.size);
            if (!size) {
                console.error(`[ERROR] Розмір ${item.size} не знайдений для кольору ${item.color} у товарі ${item.title}.`);
                return res.status(404).json({ message: `Розмір ${item.size} не знайдений для кольору ${item.color} у товарі ${item.title}` });
            }

            if (size.availableQuantity < item.quantity) {
                console.error(`[ERROR] Недостатньо товару: ${item.title}, колір: ${item.color}, розмір: ${item.size}. Запитано: ${item.quantity}, Доступно: ${size.availableQuantity}`);
                return res.status(400).json({
                    message: `Недостатньо товару: ${item.title}, колір: ${item.color}, розмір: ${item.size}`
                });
            }

            size.availableQuantity -= item.quantity;
            await product.save();
            console.log(`[DEBUG] Оновлено залишки товару ${item.title}, колір: ${item.color}, розмір: ${item.size}. Залишилось: ${size.availableQuantity}`);
        }

        if (!user) {
            await order.save();
        } else {
            user.orders.push(newOrder);
            await order.save();
            await user.save();
        }

        const crmOrderData = {
            delivery: {
                volumeGeneral: 0.0004,
                serviceType: "DoorsDoors",
                payerType: "Sender",
                cargoType: "Parcel",
                paymentMethod: "NonCash",
                price: orderDetails.totalCost,
                weight: 0.1,
                seatsAmount: orderDetails.products.length,
                city: orderDetails.city,
                department: orderDetails.warehouse,
                type: "newpost",
                integrationDeliveryId: 2013
            },
            products: orderDetails.products.map(item => ({
                productVariationId: item.id,
                title: item.title,
                quantity: item.quantity,
                price: item.cost,
                isUpsale: false,
                warehouse: { id: 1 },
            })),
            externalId: orderDetails.order_number,
            payment: {
                settlementAccountId: 2936,
                amount: orderDetails.totalCost,
            },
            client: {
                fullname: `${orderDetails.firstname}`,
                phone: `+${orderDetails.number_phone}`,
                email: orderDetails.email,
            },
            statusId: 1492,
            responsibleId: 515,
            salesChannelId: 1071,
        };

        console.log("[DEBUG] Дані замовлення для CRM:", JSON.stringify(crmOrderData, null, 2));

        const crmResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(crmOrderData),
        });

        const responseText = await crmResponse.text();
        console.log("[DEBUG] Статус відповіді CRM:", crmResponse.status);
        console.log("[DEBUG] Тіло відповіді CRM:", responseText);

        if (!crmResponse.ok) {
            console.error(`[ERROR] Не вдалося відправити замовлення у CRM. Статус: ${crmResponse.status}, Відповідь: ${responseText}`);
            return res.status(400).json({
                message: "Не вдалося відправити замовлення у CRM",
                crmStatus: crmResponse.status,
                crmResponse: responseText
            });
        }

        const crmResult = JSON.parse(responseText);
        console.log('[DEBUG] Замовлення успішно відправлено у CRM:', crmResult);

        return res.status(201).json({ message: 'Замовлення успішно оформлено та відправлено у CRM', order: newOrder });
    } catch (error) {
        console.error('[ERROR] Помилка при оформленні замовлення:', error);
        return res.status(500).json({ message: 'Помилка сервера', error: error.message });
    }
};
