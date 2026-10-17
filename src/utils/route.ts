import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { sellerRoutes } from "../modules/sellers/sellers.route";
import { categoryRouter } from "../modules/category/category.route";
import { storesRoute } from "../modules/stores/stores.route";

const router = Router();

router.use("/auth", authRoutes)
router.use("/seller", sellerRoutes)
router.use("/category", categoryRouter)
router.use("/stores",storesRoute)

export const apiRoutes = router