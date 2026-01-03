import { Router } from "express";
import studentController from "../controller/student.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, studentController.createStudent);
router.get("/", authMiddleware, studentController.getAllStudents);
router.get("/:id", authMiddleware, studentController.getStudentById);
router.put("/:id", authMiddleware, studentController.updateStudent);
router.delete("/:id", authMiddleware, studentController.deleteStudent);

export default router;
