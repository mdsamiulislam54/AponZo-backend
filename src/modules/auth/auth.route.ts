import { Router } from "express"
import { authController } from "./auth.controller"

const router = Router()

router.post("/create-user", authController.createUser)

export const authRoutes = router