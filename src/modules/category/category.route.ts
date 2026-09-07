import { Router } from "express";
import { categoryController } from "./category.controller";
import { authorization } from "../../middlewares/authorization";
import { Role } from "../../constants/role";
import { zodValidation } from "../../middlewares/zodValidation";
import { categorySchema } from "./category.validation";

const router = Router();
router.post("/", authorization(Role.ADMIN), zodValidation(categorySchema), categoryController.createCategory);

router.get("/", authorization(Role.ADMIN), categoryController.getCategoryWithParentAndChildren);

router.get("/parent", authorization(Role.ADMIN), categoryController.getCategoryWithParent);
router.get("/children", authorization(Role.ADMIN), categoryController.getCategoryWithChildren);

router.patch("/:id", authorization(Role.ADMIN), zodValidation(categorySchema), categoryController.updateCategory);
router.delete("/:id", authorization(Role.ADMIN), categoryController.deleteCategory);

export const categoryRouter = router;