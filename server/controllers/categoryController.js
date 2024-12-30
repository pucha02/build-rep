import Category from '../MongooseModels/Category.js'; 

export const getCategories = async (req, res) => {
    
    try {
        const foundCategories = await Category.find();
        
        if (!foundCategories) {
            return res.status(404).json({ message: 'Категорія не знайдена' });
        }
        res.json(foundCategories);
    } catch (error) {
        res.status(500).json({ message: 'Помилка отримання даних', error });
    }
};