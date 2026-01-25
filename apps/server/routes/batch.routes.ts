import { Router } from "express";
import BatchController from "../controller/batch.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.post("/create-batch", authMiddleware, BatchController.createBatch);
router.get("/get-all-batch/:id", authMiddleware, BatchController.getAllBatches);
router.get(
  "/get-batch-by-id/:id",
  authMiddleware,
  BatchController.getBatchById,
);
router.put(
  "/update-batch-by-id/:id",
  authMiddleware,
  BatchController.updateBatch,
);
router.delete(
  "/delete-batch-by-id/:id",
  authMiddleware,
  BatchController.deleteBatch,
);
export default router;
