import { Router } from "express";
import { 
    getNotifications, 
    markAsRead,
    deleteNotification
} from "../controllers/notification.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", authenticate, getNotifications);
router.patch("/:id/read", authenticate, markAsRead);
router.delete("/:id", authenticate, deleteNotification);

export default router;