import { Router } from "express";
import adminController from "../controller/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import superAdminController from "../controller/super-admin.controller";

const router = Router();

router.post("/create-admin", authMiddleware, adminController.createAdmin);
router.get("/get-all-admin", authMiddleware, adminController.getAllAdmins);
router.get(
  "/get-admin-by-id/:id",
  authMiddleware,
  adminController.getAdminbyId,
);
router.put(
  "/update-admin-by-id/:id",
  authMiddleware,
  adminController.updateAdmin,
);
router.delete(
  "/delete-admin-by-id/:id",
  authMiddleware,
  adminController.deleteAdmin,
);
router.get("/db-info", authMiddleware, superAdminController.getAllInformation);
router.get(
  "/dashboard",
  authMiddleware,
  adminController.getAdminDashboardInfo
);
export default router;
