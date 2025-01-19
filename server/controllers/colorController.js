import Color from "../MongooseModels/Color.js";

export const getColors = async (req, res) => {
    try {
        const colors = await Color.find();
        res.status(200).json(colors);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};