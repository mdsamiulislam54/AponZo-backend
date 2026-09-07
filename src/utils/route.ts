import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { sellerRoutes } from "../modules/sellers/sellers.route";
import { categoryRouter } from "../modules/category/category.route";

const router = Router();

router.use("/auth", authRoutes)
router.use("/seller", sellerRoutes)
router.use("/category", categoryRouter)


export const apiRoutes = router