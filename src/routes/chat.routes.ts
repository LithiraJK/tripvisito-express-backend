import { Router } from "express";
import { getChatHistory } from "../controllers/chat.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/history/:roomId", authenticate, getChatHistory);

export default router;