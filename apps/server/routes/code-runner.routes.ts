import { Router } from "express";
import codeRunnerController from "../controller/code-runner.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const router = Router();

router.post("/run", codeRunnerController.runCode);
router.post("/compile", codeRunnerController.compileCode);
router.post("/submit", authMiddleware, codeRunnerController.submitCode);

export default router;
