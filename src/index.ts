import express from "express";
import mongoose from "mongoose";
import authRouter from "./routes/auth.routes";
import tripRouter from "./routes/trip.routes";
import paymentRouter from "./routes/payment.routes";
import { createSuperAdmin } from "./controllers/auth.controller";
import cors from "cors";
import { env } from "./config/env";
import { handleStripeWebhook } from "./middlewares/webhook.middleware";
import http from "http";
import { Server } from "socket.io";
import chatRouter from "./routes/chat.routes";
import { initializeSocketService } from "./services/socket.service";


const app = express();
const server = http.createServer(app);

app.post(
  "/api/v1/payment/stripe-webhook", 
  express.raw({ type: "application/json" }), 
  handleStripeWebhook
);

app.use(express.json());
app.use(
  cors({
    origin: [env.CORS_ORIGIN],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
)

const io = new Server(server, {
  cors: { origin: [env.CORS_ORIGIN] }
});

initializeSocketService(io);

// ... Routes ...
app.use("/api/v1/auth" , authRouter );
app.use("/api/v1/trip" , tripRouter);
app.use("/api/v1/payment" ,paymentRouter);
app.use("/api/v1/chat" , chatRouter);

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
  

server.listen(process.env.PORT, () => {
  console.log(
    `Server is running on http://${env.HOST}:${env.PORT}`
  );
});


