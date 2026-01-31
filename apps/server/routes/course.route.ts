import { Router } from "express";
import courseController from "../controller/course.controller";
import courseContentController from "../controller/course-content.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import upload from "../middleware/multer.middleware";
import courseAssignmentController from "../controller/course-assignment.controller";
import courseGradeController from "../controller/course-grade.controller";
import courseProgressController from "../controller/course-progress.controller";
import courseEnrollmentController from "../controller/course-enrollment.controller";
const router = Router();

// course related api calls
router.post("/create-course", authMiddleware, courseController.createCourse);
router.post(
  "/upload-thumbnail/:id",
  authMiddleware,
  upload.single("thumbnail"),
  courseController.uploadThumbnail,
);
router.post(
  "/upload-completion-certificate/:id",
  authMiddleware,
  upload.single("certificate"),
  courseController.uploadCompletionCertificate,
);
router.put(
  "/change-publish-status/:id",
  authMiddleware,
  courseController.changePublishStatus,
);
router.put("/update-course/:id", authMiddleware, courseController.updateCourse);
router.get(
  "/get-all-courses-by-admin",
  authMiddleware,
  courseController.getAllCoursesByAdmin,
);
router.get(
  "/get-course-by-id/:id",
  authMiddleware,
  courseController.getCourseById,
);
router.get(
  "/get-all-sections-by-course/:id",
  authMiddleware,
  courseController.getAllSectionsByCourse,
);
router.delete(
  "/delete-course/:id",
  authMiddleware,
  courseController.removeCourse,
);

// course individual section
router.get(
  "/get-course-section/:id",
  authMiddleware,
  courseController.getCourseSectionContent,
);
router.post(
  "/add-course-section/:id",
  authMiddleware,
  courseController.addCourseSection,
);
router.put(
  "/update-course-section/:id",
  authMiddleware,
  upload.none(),
  courseController.updateCourseSection,
);
router.delete(
  "/delete-course-section/:id",
  authMiddleware,
  courseController.removeCourseSection,
);

//course content
router.post(
  "/add-content-to-section",
  authMiddleware,
  courseContentController.addContentToSection,
);
router.delete(
  "/delete-content/:id",
  authMiddleware,
  courseContentController.deleteContentFromSection,
);
router.put(
  "/update-content-to-section/:id",
  authMiddleware,
  upload.single("file"),
  courseContentController.updateContentToSection,
);
router.post(
  "/upload-file-in-content/:id",
  authMiddleware,
  upload.single("content"),
  courseContentController.uploadFileToContent,
);
router.delete(
  "/remove-file-in-content/:id",
  authMiddleware,
  courseContentController.removeFileFromContent,
);

// course-assignment
router.post(
  "/add-assignment-to-section/",
  authMiddleware,
  courseAssignmentController.addAssignmentToSection,
);
router.put(
  "/update-assignment-to-section/:id",
  authMiddleware,
  courseAssignmentController.updateAssignmentToSection,
);
router.delete(
  "/remove-assignment-from-section/:id",
  authMiddleware,
  courseAssignmentController.removeAssignmentFromSection,
);
router.get(
  "/get-assignment-by-id/:id",
  authMiddleware,
  courseAssignmentController.getAssignmentById,
);

// course-assignment-question
router.post(
  "/add-assignment-question/:id",
  authMiddleware,
  courseAssignmentController.addCourseAssignemntQuestion,
);
router.put(
  "/update-assignment-question/:id",
  authMiddleware,
  courseAssignmentController.updateCourseAssignemntQuestion,
);
router.delete(
  "/remove-assignment-question/:id",
  authMiddleware,
  courseAssignmentController.removeCourseAssignemntQuestion,
);
router.get(
  "/get-all-section-assignments/:id",
  authMiddleware,
  courseAssignmentController.getAllAssignmentFromSection,
);

//course-grade

router.get(
  "/get-all-assignment-marks/",
  authMiddleware,
  courseGradeController.getAllAssignmentMarks,
);
router.get(
  "/get-all-assignment-marks-by-courseId/:id",
  authMiddleware,
  courseGradeController.getAssignmentMarksByCourseId,
);
router.post(
  "/submit-course-assignment/:id",
  authMiddleware,
  courseGradeController.submitCourseAssignment,
);

//course-progress
router.post(
  "/mark-content-as-done/:id",
  authMiddleware,
  courseProgressController.markAsDone,
);
router.post(
  "/unmark-content-as-done/:id",
  authMiddleware,
  courseProgressController.unMarksAsDone,
);
router.get(
  "/get-all-course-progress/",
  authMiddleware,
  courseProgressController.getAllCourseProgress,
);
router.get(
  "/get-individual-course-progress/:id",
  authMiddleware,
  courseProgressController.getCourseProgressById,
);

// course-enrollments
router.get(
  "/get-course-enrollments/:id",
  authMiddleware,
  courseEnrollmentController.getAllEnrollmentsById,
);
router.get(
  "/get-course-enrollments-by-batch/:id",
  authMiddleware,
  courseEnrollmentController.getAllEnrollmentsByBatch,
);
router.post(
  "/add-course-enrollment/",
  authMiddleware,
  courseEnrollmentController.addEnrollment,
);
router.delete(
  "/remove-course-enrollment/:id",
  authMiddleware,
  courseEnrollmentController.removeEnrollment,
);

router.get(
  "/get-student-courses",
  authMiddleware,
  courseController.getStudentCourses
)
export default router;
