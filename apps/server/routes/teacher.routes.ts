import { Router } from "express";
import teacherController from "../controller/teacher.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-teacher", authMiddleware, teacherController.createTeacher);
router.get(
  "/get-all-teacher",
  authMiddleware,
  teacherController.getAllTeachers,
);
router.get(
  "/get-teacher-by-id/:id",
  authMiddleware,
  teacherController.getTeacherById,
);
router.get(
  "/get-teacher-by-institute/:id",
  authMiddleware,
  teacherController.getTeacherByInstitute,
);
router.get(
  "/get-teacher-by-batch/:id",
  authMiddleware,
  teacherController.getTeacherByBatch,
);
router.put(
  "/update-teacher-by-id/:id",
  authMiddleware,
  teacherController.updateTeacher,
);
router.delete(
  "/delete-teacher-by-id/:id",
  authMiddleware,
  teacherController.deleteTeacher,
);
export default router;
