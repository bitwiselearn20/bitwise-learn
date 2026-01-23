import { Router } from "express";
import AssessmentController from "../controller/assessment.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import assessmentController from "../controller/assessment.controller";
import assessmentSectionController from "../controller/assessment-section.controller";

const router = Router();

router.post("/create-assessment", authMiddleware, AssessmentController.createAssessment);
router.get("/get-all-assessment", authMiddleware, AssessmentController.getAllAssessment);
router.get(
    "/get-assessment-by-id/:id",
    authMiddleware,
    AssessmentController.getAssessmentById
);
router.put(
    "/update-assessment-by-id/:id",
    authMiddleware,
    AssessmentController.updateAssessment
);
router.delete(
    "/delete-assessment-by-id/:id",
    authMiddleware,
    AssessmentController.deleteAssessment
);
// assessment sections
router.get(
    "/get-assessment-section/:id",
    authMiddleware,
    assessmentSectionController.getAllAssessmentSection
  );
  
router.post(
    "/add-assessment-section",
    authMiddleware,
    assessmentSectionController.createAssessmentSection,
);
router.put(
    "/update-assessment-section/:id",
    authMiddleware,
    assessmentSectionController.updateAssessmentSection,
);
router.delete(
    "/delete-assessment-section/:id",
    authMiddleware,
    assessmentSectionController.deleteAssessmentSection,
);
export default router;
