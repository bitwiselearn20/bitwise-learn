import { Router } from "express";
import studentController from "../controller/student.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/create-student", authMiddleware, studentController.createStudent);
router.get("/get-all-student", authMiddleware, studentController.getAllStudents);
router.get(
    "/get-student-by-id/:id",
    authMiddleware,
    studentController.getStudentById
);
router.put(
    "/update-insitituion-by-id/:id",
    authMiddleware,
    studentController.updateStudent
);
router.delete(
    "/delete-student-by-id/:id",
    authMiddleware,
    studentController.deleteStudent
);
export default router;