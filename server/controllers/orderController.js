import Product from '../MongooseModels/Product.js';
import { User } from '../MongooseModels/User.js';
import { Order } from '../MongooseModels/User.js';

const apiUrl = "https://crm.sitniks.com/open-api/orders";
const token = "nGB8rpzNAT1nOAuSQqyV1nXBBmwGgXTTNHSYW8hjF17";

export const registerOrder = async (req, res) => {
    const orderDetails = req.body;

    try {
        console.log("[DEBUG] Order Details received:", JSON.stringify(orderDetails, null, 2));

        const user = await User.findOne({ number_phone: orderDetails.number_phone });
        if (!user) {
            console.log("[DEBUG] User not found. Creating new user.");
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

        console.log("[DEBUG] Constructed newOrder:", JSON.stringify(newOrder, null, 2));

        const order = new Order(newOrder);

        for (const item of orderDetails.products) {
            console.log(`[DEBUG] Checking product: ${item.title}, color: ${item.color}, size: ${item.size}`);

            const product = await Product.findOne({ title: item.title });
            if (!product) {
                console.error(`[ERROR] Product with title ${item.title} not found.`);
                return res.status(404).json({ message: `Product with title ${item.title} not found` });
            }

            const color = product.color.find(c => c.color_name === (item.color.color_name || item.color));
            if (!color) {
                console.error(`[ERROR] Color ${item.color} not found in product ${item.title}.`);
                return res.status(404).json({ message: `Color ${item.color} not found in product ${item.title}` });
            }

            const size = color.sizes.find(s => s.size_name === item.size);
            if (!size) {
                console.error(`[ERROR] Size ${item.size} not found in color ${item.color} for product ${item.title}.`);
                return res.status(404).json({ message: `Size ${item.size} not found in color ${item.color} for product ${item.title}` });
            }

            if (size.availableQuantity < item.quantity) {
                console.error(`[ERROR] Not enough stock for product: ${item.title}, color: ${item.color}, size: ${item.size}. Requested: ${item.quantity}, Available: ${size.availableQuantity}`);
                return res.status(400).json({
                    message: `Not enough stock for product: ${item.title}, color: ${item.color}, size: ${item.size}`
                });
            }

            size.availableQuantity -= item.quantity;
            await product.save();
            console.log(`[DEBUG] Updated product stock for ${item.title}, color: ${item.color}, size: ${item.size}. Remaining: ${size.availableQuantity}`);
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

        console.log("[DEBUG] CRM Order Data:", JSON.stringify(crmOrderData, null, 2));

        const crmResponse = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(crmOrderData),
        });

        const responseText = await crmResponse.text();
        console.log("[DEBUG] CRM Response Status:", crmResponse.status);
        console.log("[DEBUG] CRM Response Body:", responseText);

        if (!crmResponse.ok) {
            console.error(`[ERROR] Failed to send order to CRM. Status: ${crmResponse.status}, Response: ${responseText}`);
            return res.status(400).json({
                message: "Failed to send order to CRM",
                crmStatus: crmResponse.status,
                crmResponse: responseText
            });
        }

        const crmResult = JSON.parse(responseText);
        console.log('[DEBUG] Order sent to CRM successfully:', crmResult);

        return res.status(201).json({ message: 'Order placed successfully and sent to CRM', order: newOrder });
    } catch (error) {
        console.error('[ERROR] Error placing order:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
