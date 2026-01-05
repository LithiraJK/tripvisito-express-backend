import { Router } from "express";
import { addNewUser, deleteUser, getAllUsers, getMyProfile, googleLogin, loginUser, refreshToken, registerAdmin, registerUser, updateUserStatus } from "../controllers/auth.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";
import { Role } from "../models/user.model";
import { upload } from "../middlewares/upload.middleware";


const router = Router();

router.post("/register" , registerUser)

router.post("/login", loginUser)

router.post("/google-login", googleLogin);

router.get("/me" , authenticate , getMyProfile)

router.post("/refresh" , refreshToken)

router.post("/register/admin" , authenticate, requireRole([Role.SUPERADMIN]), registerAdmin)

router.get("/users" , authenticate , requireRole([Role.ADMIN , Role.SUPERADMIN]), getAllUsers )

router.post("/register/new-user" , authenticate, requireRole([Role.ADMIN , Role.SUPERADMIN]), upload.single("profileimg") , addNewUser)

router.put("/status/:id" , authenticate, requireRole([Role.ADMIN , Role.SUPERADMIN]) , updateUserStatus)

router.delete("/delete/:id" , authenticate , requireRole([Role.ADMIN , Role.SUPERADMIN]) , deleteUser )


export default router;