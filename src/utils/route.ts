import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { sellerRoutes } from "../modules/sellers/sellers.route";

const router = Router();

router.use("/auth", authRoutes)
router.use("/seller", sellerRoutes)


export const apiRoutes = router