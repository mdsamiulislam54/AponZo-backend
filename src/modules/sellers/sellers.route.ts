import { Router } from "express";
import { sellerController } from "./seller.controller";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../constants/role";
import { zodValidation } from "../../middlewares/zodValidation";
import { sellerAddressSchema, sellerAddressSchemaUpdate } from "./seller.zod.validation";

const router = Router();

router.get("/profile", authorization(Role.SELLER, Role.ADMIN), sellerController.getSellerProfile);
router.patch("/profile", authorization(Role.SELLER, Role.ADMIN), sellerController.sellerProfileUpdate);


router.get("/address", authorization(Role.SELLER, Role.ADMIN), sellerController.getSellerAddress);
router.post("/address", authorization(Role.SELLER, Role.ADMIN), zodValidation(sellerAddressSchema), sellerController.createSellerAddress);
router.patch("/address/:id", authorization(Role.SELLER, Role.ADMIN), zodValidation(sellerAddressSchemaUpdate), sellerController.updateSellerAddress);
router.delete("/address/:id", authorization(Role.SELLER, Role.ADMIN), sellerController.deleteSellerAddress);


router.get("/documents", authorization(Role.SELLER, Role.ADMIN), sellerController.getSellerDocument);
router.post("/documents", authorization(Role.SELLER, Role.ADMIN), sellerController.createSellerDocument);
router.patch("/documents/:id", authorization(Role.SELLER, Role.ADMIN), sellerController.updateSellerDocument);
router.delete("/documents/:id", authorization(Role.SELLER, Role.ADMIN), sellerController.deleteSellerDocument);

export const sellerRoutes = router;



