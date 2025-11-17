import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.routes";
import { createSuperAdmin } from "./controllers/auth.controller";
import cors from "cors";
import { env } from "./config/env";


const app = express();

app.use(express.json());
app.use(
  cors({
    origin: [env.CORS_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"] // optional
  })
)

app.use("/api/v1/auth" , authRouter );

mongoose
  .connect(env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    createSuperAdmin();
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });
  

app.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://${env.HOST}:${env.PORT}`
  );
});


