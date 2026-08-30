import { Router } from "express"
import { authController } from "./auth.controller"
import { zodValidation } from "../../middlewares/zodValidation"
import { createUserSchema, loginSchema } from "./auth.zod.validation"

const router = Router()

router.post("/register", zodValidation(createUserSchema), authController.createUser)
router.post("/login", zodValidation(loginSchema), authController.loginUser)
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export const authRoutes = router