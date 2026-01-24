// import { Router } from "express";
// import batchController from "../controller/batch.controller";
// import { authMiddleware } from "../middleware/auth.middleware";

// const router = Router();

// router.post("/", authMiddleware, batchController.createBatch);
// router.get("/", authMiddleware, batchController.getAllBatches);
// router.get("/:id", authMiddleware, batchController.getBatchById);
// router.put("/:id", authMiddleware, batchController.updateBatch);
// router.delete("/:id", authMiddleware, batchController.deleteBatch);

// export default router;
import { Router } from "express";
import batchController from "../controller/batch.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-batch", authMiddleware, batchController.createBatch);
router.get("/get-all-batch/:id",
    authMiddleware,
    batchController.getAllBatchesForInstitution);
router.get(
    "/get-batch-by-id/:id",
    authMiddleware,
    batchController.getBatchById
);
router.put(
    "/update-batch-by-id/:id",
    authMiddleware,
    batchController.updateBatch
);
router.delete(
    "/delete-batch-by-id/:id",
    authMiddleware,
    batchController.deleteBatch
);
export default router;
