import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import stockRoutes from "./integration/exchangeStocks.js"
import promoCodeRoutes from './routes/promocodeRoutes.js'
import messageRoutes from './routes/messageRoutes.js'


const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/admin/api/categories", categoryRoutes);
app.use('/admin/api/products', productRoutes);
app.use("/admin/api/users", userRoutes);
app.use('/admin/api/integration', stockRoutes);
app.use('/admin/api/promocode', promoCodeRoutes);
app.use("/admin/api/message", messageRoutes);

app.listen(5002, () => {
  console.log("Server is running on port 5001");
});
