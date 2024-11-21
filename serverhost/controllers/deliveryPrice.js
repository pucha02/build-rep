// Import the MinPrice model
import DeliveryPrice from "../models/DeliveryPrice.js";

export const putDeliveryPrice = async (req, res) => {
    const { deliveryPrice } = req.query;

    if (!deliveryPrice) {
        return res.status(400).json({ message: "Delivery price is required in query parameters" });
    }

    try {
        const updatedMinPrice = await DeliveryPrice.findOneAndUpdate(
            {}, // Finds any existing document
            { deliveryPrice }, // Updates the minPrice field
            { new: true, upsert: true } // Creates a new document if none exists
        );

        res.status(200).json({ message: "Delivery price updated successfully", data: updatedMinPrice });
    } catch (error) {
        res.status(500).json({ message: "Error updating Delivery price", error });
    }
};

export const getDeliveryPrice = async (req, res) => {
    try {
        const foundMinPrice = await DeliveryPrice.findOne();
        if (!foundMinPrice) {
            return res.status(404).json({ message: "No Delivery price found" });
        }
        res.json(foundMinPrice);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving Delivery price", error });
    }
};
