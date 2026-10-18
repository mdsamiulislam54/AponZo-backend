import { Router } from "express";
import { authorization } from "../../middlewares/authorization";
import { USER_ROLE } from "../../constants/user.constants";
import upload from "../../middlewares/upload";
import { zodValidation } from "../../middlewares/zodValidation";
import { productsZodSchema } from "./products.validation";
import { productsController } from "./products.controller";

const router = Router();

router.post(
    "/",
    authorization(USER_ROLE.SELLER,USER_ROLE.ADMIN),
    upload.array("images",5),
    zodValidation(productsZodSchema),
    productsController.createProducts

)

export const productsRoute = router;
