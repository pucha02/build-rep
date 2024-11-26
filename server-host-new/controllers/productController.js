import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ categoryOrder: 1, productOrder: 1 });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
};