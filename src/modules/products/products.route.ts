import { Router } from "express";
import { authorization } from "../../middlewares/authorization";
import { USER_ROLE } from "../../constants/user.constants";
import upload from "../../middlewares/upload";
import { zodValidation } from "../../middlewares/zodValidation";
import { productsZodSchema } from "./products.validation";
import { productsController } from "./products.controller";

const router = Router();
router.get("/" ,productsController.getAllProducts);
// router.get("/:productId",);

router.post(
    "/",
    authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),
    upload.array("images", 5),
    zodValidation(productsZodSchema),
    productsController.createProducts

)
// router.patch(
//     "/:productId",
//     authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),
//     upload.array("images", 5),
//     zodValidation(productsZodSchema.partial()),
//     // productsController.replaceProductsImages
// )

router.patch(
    "/:productId/images/:imageId",
    authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),
    upload.single("image"),
    productsController.replaceProductsImages
)

router.delete("/:productId", productsController.deleteProductById)

export const productsRoute = router;
