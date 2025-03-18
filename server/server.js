import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import stockRoutes from "./integration/exchangeStocks.js"
import createProdRoutes from '../server/integration/create-prod-from-crm.js'
import promoCodeRoutes from './routes/promocodeRoutes.js'
import messageRoutes from './routes/messageRoutes.js'
import exchangeRateRoutes from "./routes/exchangeRateRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/admin/api/categories", categoryRoutes);
app.use('/admin/api/products', productRoutes);
app.use("/admin/api/users", userRoutes);
app.use('/admin/api/integration', stockRoutes);
app.use('/admin/api/create', createProdRoutes);
app.use('/admin/api/promocode', promoCodeRoutes);
app.use("/admin/api/message", messageRoutes);
app.use("/admin/api/exchange", exchangeRateRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 5001");
});
