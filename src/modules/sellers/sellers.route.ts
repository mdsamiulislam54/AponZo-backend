import { Router } from "express";
import { sellerController } from "./seller.controller";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../constants/role";

const router = Router();

router.get("/profile", authorization(Role.SELLER, Role.ADMIN), sellerController.getSellerProfile);
router.patch("/profile", authorization(Role.SELLER, Role.ADMIN), sellerController.sellerProfileUpdate);

router.post("/address", authorization(Role.SELLER, Role.ADMIN), sellerController.createSellerAddress);
router.patch("/address", authorization(Role.SELLER, Role.ADMIN), sellerController.updateSellerAddress);
router.get("/address", authorization(Role.SELLER, Role.ADMIN), sellerController.getSellerAddress);
router.delete("/address", authorization(Role.SELLER, Role.ADMIN), sellerController.deleteSellerAddress);

router.post("/documents", authorization(Role.SELLER, Role.ADMIN), sellerController.createSellerDocument);
router.get("/documents", authorization(Role.SELLER, Role.ADMIN), sellerController.getSellerDocument);
router.patch("/documents", authorization(Role.SELLER, Role.ADMIN), sellerController.updateSellerDocument);
router.delete("/documents", authorization(Role.SELLER, Role.ADMIN), sellerController.deleteSellerDocument);

export const sellerRoutes = router;



