import { Router } from "express";
import dsaQuestionController from "../controller/dsa-question.controller";
import { adminMiddleware } from "../middleware/auth.middleware";
const problemsRouter = Router();
/** 

update-testcase-to-problem/:id
delete-testcase-to-problem/:id
add-solution-to-problem/:id
update-solution-to-problem/:id
delete-solution-to-problem/:id
*/

problemsRouter.get(
  "/get-all-dsa-problem/",
  dsaQuestionController.getAllDsaProblem
);
problemsRouter.get(
  "/get-dsa-problem/:id/",
  dsaQuestionController.getDsaProblemById
);
problemsRouter.get(
  "/get-dsa-problems-by-tag",
  dsaQuestionController.getDsaProblemByTag
);
problemsRouter.post(
  "/add-problem/",
  adminMiddleware,
  dsaQuestionController.addDsaProblem
);
problemsRouter.post(
  "/update-problem/:id",
  adminMiddleware,
  dsaQuestionController.updateDsaProblem
);
problemsRouter.post(
  "/delete-problem/:id",
  adminMiddleware,
  dsaQuestionController.deleteDsaProblem
);
problemsRouter.post(
  "/add-topic-to-problem/:id",
  adminMiddleware,
  dsaQuestionController.addTopicToProblem
);
problemsRouter.post(
  "/update-topic-to-problem/:id",
  adminMiddleware,
  dsaQuestionController.updateTopicToProblem
);
problemsRouter.post(
  "/delete-topic-from-problem/:id",
  adminMiddleware,
  dsaQuestionController.deleteTopicFromProblem
);
problemsRouter.post(
  "/add-template-to-problem/:id",
  adminMiddleware,
  dsaQuestionController.addQuestionTemplate
);
problemsRouter.post(
  "/update-template-to-problem/:id",
  adminMiddleware,
  dsaQuestionController.updateQuestionTemplate
);
problemsRouter.post(
  "/delete-template-from-problem/:id",
  adminMiddleware,
  dsaQuestionController.deleteQuestionTemplate
);
problemsRouter.post(
  "/add-testcase-to-problem/:id",
  adminMiddleware,
  dsaQuestionController.addTestCaseToProblem
);
problemsRouter.post(
  "/update-testcase-to-problem/:id",
  adminMiddleware,
  dsaQuestionController.addTestCaseToProblem
);
problemsRouter.post(
  "/delete-testcase-to-problem/:id",
  adminMiddleware,
  dsaQuestionController.addTestCaseToProblem
);

export default problemsRouter;
