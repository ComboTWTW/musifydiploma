import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import geniusRoutes from "./routes/genius.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/genius", geniusRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});
