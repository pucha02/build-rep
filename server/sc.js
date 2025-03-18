import mongoose from "mongoose";
import Product from "./models/Product.js"; // корректный путь

mongoose.connect("mongodb+srv://dentistry064:MpehbDFQf09n7a1v@cluster0.d9svw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    console.log("Connected to MongoDB");
    const result = await Product.updateMany(
      {},
      { $rename: { "cost": "costEUR" } },
      { writeConcern: { w: "majority" } }
    );
    console.log("Update result:", result);
    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
