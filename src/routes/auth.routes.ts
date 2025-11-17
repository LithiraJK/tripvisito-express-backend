import { Router } from "express";
import { loginUser, registerAdmin, registerUser } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "../models/user.model";


const router = Router();

router.post("/register" , registerUser)

router.post("/login", loginUser)

router.post("/register/admin" , authenticate, requireRole([Role.SUPERADMIN]), registerAdmin)


export default router;