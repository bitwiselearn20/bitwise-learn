import { Router } from "express";
import AssessmentController from "../controller/assessment.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import assessmentController from "../controller/assessment.controller";
import assessmentSectionController from "../controller/assessment-section.controller";
import assessmentQuestionController from "../controller/assessment-question.controller";

const router = Router();
// assessment-controllers
router.post(
  "/create-assessment",
  authMiddleware,
  AssessmentController.createAssessment,
);
router.get(
  "/get-all-assessment",
  authMiddleware,
  AssessmentController.getAllAssessment,
);
router.get(
  "/get-assessment-by-id/:id",
  authMiddleware,
  AssessmentController.getAssessmentById,
);
router.put(
  "/update-assessment-by-id/:id",
  authMiddleware,
  AssessmentController.updateAssessment,
);
router.put(
  "/update-assessment-status/:id",
  authMiddleware,
  AssessmentController.changeAssessmentStatus,
);
router.delete(
  "/delete-assessment-by-id/:id",
  authMiddleware,
  AssessmentController.deleteAssessment,
);
// assessment-sections controllers
router.get(
  "/get-sections-for-assessment/:id",
  authMiddleware,
  assessmentSectionController.getAllAssessmentSection,
);

// for questions
router.get(
  "/get-assessment-section/:id",
  authMiddleware,
  assessmentSectionController.getAllAssessmentSection,
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

// assessment-question
router.post(
  "/add-assessment-question/:id",
  authMiddleware,
  assessmentQuestionController.createAssessmentQuestion,
);
router.put(
  "/update-assessment-question/:id",
  authMiddleware,
  assessmentQuestionController.updateAssessmentQuestion,
);
router.delete(
  "/delete-assessment-question/:id",
  authMiddleware,
  assessmentQuestionController.deleteAssessmentQuestion,
);
router.get(
  "/get-questions-by-sectionId/:id",
  authMiddleware,
  assessmentQuestionController.getAllSectionQuestion,
);

router.post(
  "/assignment-report/:id",
  authMiddleware,
  assessmentController.assessmentReportRequest,
);
export default router;
