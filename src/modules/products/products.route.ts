import { Router } from "express";
import { authorization } from "../../middlewares/authorization";
import { USER_ROLE } from "../../constants/user.constants";
import upload from "../../middlewares/upload";
import { zodValidation } from "../../middlewares/zodValidation";
import { productsZodSchema, productUpdateZodSchema } from "./products.validation";
import { productsController } from "./products.controller";

const router = Router();
router.get("/" ,productsController.getAllProducts);
// router.get("/:productId",);

router.post("/",authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),upload.array("images", 5),zodValidation(productsZodSchema),productsController.createProducts)
router.post("/add-image/:productId",authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),upload.single("images"),productsController.addProductImage)

router.patch(
    "/update/:productId",
    authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),
    zodValidation(productUpdateZodSchema.partial()),
    productsController.updateProductById
)


router.patch(
    "/:productId/images/:imageId",
    authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),
    upload.single("image"),
    productsController.replaceProductsImages
)

router.delete("/:productId", productsController.deleteProductById)
router.delete("specification/:id", authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN) ,productsController.deleteSpecificationById)
router.delete("variant/:id", authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN) ,productsController.deleteProductVariantById)
router.delete("/image/:imageId/product/:productId", authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),productsController.deleteProductImage)

export const productsRoute = router;
