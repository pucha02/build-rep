// Import the MinPrice model
import MinPrice from "../models/MinPrice.js";

export const putMinPrice = async (req, res) => {
    const { minPrice } = req.query;

    if (!minPrice) {
        return res.status(400).json({ message: "Min price is required in query parameters" });
    }

    try {
        const updatedMinPrice = await MinPrice.findOneAndUpdate(
            {}, // Finds any existing document
            { minPrice }, // Updates the minPrice field
            { new: true, upsert: true } // Creates a new document if none exists
        );

        res.status(200).json({ message: "Min price updated successfully", data: updatedMinPrice });
    } catch (error) {
        res.status(500).json({ message: "Error updating min price", error });
    }
};

export const getMinPrice = async (req, res) => {
    try {
        const foundMinPrice = await MinPrice.findOne();
        if (!foundMinPrice) {
            return res.status(404).json({ message: "No min price found" });
        }
        res.json(foundMinPrice);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving min price", error });
    }
};
