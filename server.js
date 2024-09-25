import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectToMongoDb } from "./config/dbConfig.js";
import { adminRouter } from "./routers/adminRouter.js";
import { categoryRouter } from "./routers/categoryRouter.js";
import { productRouter } from "./routers/productRouter.js";
import { userRouter } from "./routers/userRouter.js";

const app = express();
const PORT = process.env.PORT || 8001;

// Middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/api/admin", adminRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/user", userRouter);

// Connect to Database
connectToMongoDb();

// Run the server
app.listen(PORT, (error) => {
  error
    ? console.log("Error", error)
    : console.log("Server is running at port", PORT);
});
