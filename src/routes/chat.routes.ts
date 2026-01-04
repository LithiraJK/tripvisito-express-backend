import { Router } from "express";
import { getAllChatParticipants, getChatHistory } from "../controllers/chat.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/history/:roomId", authenticate, getChatHistory);
router.get("/active-users", authenticate, getAllChatParticipants);

export default router;