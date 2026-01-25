import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import csvUploadController from "../controller/csv-upload.controller";
import upload from "../middleware/multer.middleware";
const router = Router();

router.post(
  "/students/:id",
  authMiddleware,
  upload.single("file"),
  csvUploadController.uploadMultipleStudent,
);
router.post(
  "/batches/:id",
  authMiddleware,
  upload.single("file"),
  csvUploadController.uploadMultipleBatches,
);
router.post(
  "/testcases/:id",
  authMiddleware,
  upload.single("file"),
  csvUploadController.uploadMultipleTestCase,
);
export default router;
