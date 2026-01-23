import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import ReportController from "../controller/reports.controller";
const router = Router();

router.get(
  "/get-stats-count/:id",
  authMiddleware,
  ReportController.getCountByInstitution,
);
router.get(
  "/assessment-report/:instituteId/:assessmentId/",
  authMiddleware,
  ReportController.getAllAssesmentReports,
);
router.get(
  "/assessment-report/:instituteId/:courseId/",
  authMiddleware,
  ReportController.getCourseReport,
);

export default router;
