import { Router } from "express";
import institutionController from "../controller/institution.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/create-institution",
  authMiddleware,
  institutionController.createInstitution,
);
router.get(
  "/get-all-institution",
  authMiddleware,
  institutionController.getAllInstitutions,
);
router.get(
  "/get-institution-by-id/:id",
  authMiddleware,
  institutionController.getInstitutionById,
);
router.put(
  "/update-insitituion-by-id/:id",
  authMiddleware,
  institutionController.updateInstitution,
);
router.delete(
  "/delete-institution-by-id/:id",
  authMiddleware,
  institutionController.deleteInstitution,
);
export default router;
