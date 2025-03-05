import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  linkName: { type: String, required: true },
  brands: {type: Array},
  subcategories: [{ name: String, linkName: String, brands: Array }],
});

const Category = mongoose.model("Category", categorySchema);

export default Category;