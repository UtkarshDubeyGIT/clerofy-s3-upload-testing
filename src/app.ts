import express from "express";
import dotenv from "dotenv";
import uploadRoutes from "./routes/upload.routes";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/api", uploadRoutes);

export default app;
