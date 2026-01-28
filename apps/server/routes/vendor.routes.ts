import { Router } from "express";
import vendorController from "../controller/vendor.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-vendor", authMiddleware, vendorController.createVendor);
router.get("/get-all-vendor", authMiddleware, vendorController.getAllVendors);
router.get(
  "/get-vendor-by-id/:id",
  authMiddleware,
  vendorController.getVendorById,
);
router.put(
  "/update-vendor-by-id/:id",
  authMiddleware,
  vendorController.updateVendor,
);
router.delete(
  "/delete-vendor-by-id/:id",
  authMiddleware,
  vendorController.deleteVendor,
);
router.get(
  "/dashboard",
  authMiddleware,
  vendorController.getVendorDashboard
);
export default router;
