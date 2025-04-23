/* 
© 2025 Aravinth Raj R. All rights reserved.
Unauthorized copying of this file, via any medium, is strictly prohibited.
Proprietary and confidential.  
Written by Aravinth Raj R <aravinthr235@gmail.com>, 2025.
*/
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./config/logger.js";
import userRoutes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGOURL = process.env.MONGO_URL;

app.use(express.json());

mongoose
  .connect(String(MONGOURL))
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.warn(`Error occurred: ${err}`);
  });

app.use("/users", userRoutes);
