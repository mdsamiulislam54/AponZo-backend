import { Router } from "express";
import { categoryController } from "./category.controller";
import { authorization } from "../../middlewares/authorization";
import { zodValidation } from "../../middlewares/zodValidation";
import { categorySchema } from "./category.validation";
import { USER_ROLE } from "../../constants/user.constants";

const router = Router();
router.post("/", authorization(USER_ROLE.ADMIN), zodValidation(categorySchema), categoryController.createCategory);

router.get("/", authorization(USER_ROLE.ADMIN, USER_ROLE.SELLER), categoryController.getCategoryWithParentAndChildren);

router.get("/parent", authorization(USER_ROLE.ADMIN), categoryController.getCategoryWithParent);
router.get("/children", authorization(USER_ROLE.ADMIN), categoryController.getCategoryWithChildren);

router.patch("/:id", authorization(USER_ROLE.ADMIN), zodValidation(categorySchema), categoryController.updateCategory);
router.delete("/:id", authorization(USER_ROLE.ADMIN), categoryController.deleteCategory);

export const categoryRouter = router;