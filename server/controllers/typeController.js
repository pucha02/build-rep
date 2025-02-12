import Type from "../MongooseModels/Type.js";

export const createType = async (req, res) => {
    try {
        const type = new Type(req.body);
        await type.save();
        res.status(201).json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const getTypes = async (req, res) => {
    try {
        const types = await Type.find();
        res.status(200).json(types);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateType = async (req, res) => {
    try {
        const type = await Type.findByIdAndUpdate(req.params._id, req.body, { new: true });
        res.status(200).json(type);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

export const deleteType = async (req, res) => {
    try {
        await Type.findByIdAndDelete(req.params.id);
        console.log(req.params.id)
        res.status(200).json({ message: 'Розмір видалено' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
