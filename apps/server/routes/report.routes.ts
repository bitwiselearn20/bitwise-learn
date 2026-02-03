import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import ReportController from "../controller/reports.controller";
import assessmentController from "../controller/assessment.controller";
const router = Router();

router.get(
  "/get-stats-count/:id",
  authMiddleware,
  ReportController.getCountByInstitution,
);
router.get(
  "/assessment-report/:assessmentId/",
  authMiddleware,
  ReportController.getAllAssesmentReports,
);
router.get(
  "/course-report/:batchId/:courseId/",
  authMiddleware,
  ReportController.getCourseReport,
);
router.get(
  "/assessment-report/:id",
  authMiddleware,
  assessmentController.assessmentReportRequest,
);

export default router;
