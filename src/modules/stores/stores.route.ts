import { Router } from "express";
import { StoresController } from "./stores.controller";
import { authorization } from "../../middlewares/authorization";
import { USER_ROLE } from "../../constants/user.constants";

const router = Router();
router.post("/", authorization(USER_ROLE.ADMIN,USER_ROLE.SELLER), StoresController.createStore);
router.get("/:id", authorization(USER_ROLE.ADMIN,USER_ROLE.SELLER), StoresController.getStoreById);
router.get("/", authorization(USER_ROLE.ADMIN,USER_ROLE.SELLER), StoresController.getStoresBySellerId);
router.patch("/:id", authorization(USER_ROLE.ADMIN,USER_ROLE.SELLER), StoresController.updateStore);
router.delete("/", authorization(USER_ROLE.ADMIN,USER_ROLE.SELLER), StoresController.deleteStore);

export const storesRoute = router