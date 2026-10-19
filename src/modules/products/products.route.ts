import { Router } from "express";
import { authorization } from "../../middlewares/authorization";
import { USER_ROLE } from "../../constants/user.constants";
import upload from "../../middlewares/upload";
import { zodValidation } from "../../middlewares/zodValidation";
import { productsZodSchema, productUpdateZodSchema } from "./products.validation";
import { productsController } from "./products.controller";
import { imageController } from "./controller/image.controller";
import { variantController } from "./controller/variant.controller";
import { specificationController } from "./controller/specification.controller";
import { inventoryController } from "./controller/inventory.controller";

const router = Router();

//product route

router.patch("/update/:productId",authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),zodValidation(productUpdateZodSchema.partial()),productsController.updateProductById)
router.delete("/:productId", productsController.deleteProductById)
router.get("/" ,productsController.getAllProducts);
router.post("/",authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),upload.array("images", 5),zodValidation(productsZodSchema),productsController.createProducts)



// Images route

router.delete("/image/:imageId/product/:productId", authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),imageController.deleteProductImage)
router.patch("/:productId/images/:imageId",authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),upload.single("image"), imageController.replaceProductsImages
)
router.post("/add-image/:productId",authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN),upload.single("images"),imageController.addProductImage)


// Specification route

router.delete("specification/:id", authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN) ,specificationController.deleteSpecificationById)


// Variant route
router.delete("variant/:id", authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN) ,variantController.deleteProductVariantById)


//inventory route
router.get("/inventory", authorization(USER_ROLE.SELLER, USER_ROLE.ADMIN), inventoryController.getInventory)

export const productsRoute = router;
