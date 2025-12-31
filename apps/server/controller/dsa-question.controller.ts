import type { Request, Response } from "express";
import apiResponse from "../utils/apiResponse";
import type {
  ProblemBody,
  ProblemSolution,
  ProblemTemplate,
  ProblemTestCaseBody,
  UpdatedProblemTestCaseBody,
  UpdateProblemBody,
  UpdateProblemTemplate,
} from "../utils/type";
import prismaClient from "../utils/prisma";
/**
 * ProblemTestCase Problem
 */
class DsaQuestionController {
  // base problem creation
  async addDsaProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const data: ProblemBody = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { name: data.name },
      });
      if (dbProblem) throw new Error("problem already exists");

      // create a transaction
      const createdProblem = await prismaClient.problem.create({
        data: {
          name: data.name,
          description: data.description,
          hints: data.hints,
          difficulty: data.difficulty,
          createdBy: dbAdmin.id,
        },
      });

      if (!createdProblem) throw new Error("problem not created!");

      return res
        .status(200)
        .json(apiResponse(200, "problem created successfully", createdProblem));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateDsaProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;
      const data: UpdateProblemBody = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");

      // create a transaction
      const udpatedProblem = await prismaClient.problem.update({
        where: { id: dbProblem.id },
        data: {
          description: data.description ?? dbProblem.description,
          hints: data.hints ?? dbProblem.hints,
        },
      });

      if (!udpatedProblem) throw new Error("problem not updated!");

      return res
        .status(200)
        .json(apiResponse(200, "problem updated successfully", udpatedProblem));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteDsaProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");

      const removedProblem = await prismaClient.problem.delete({
        where: { id: dbProblem.id },
      });

      if (!removedProblem) throw new Error("problem not removed!");

      return res
        .status(200)
        .json(apiResponse(200, "problem removed successfully", removedProblem));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  //TODO: implement pagination service
  async getAllDsaProblem(req: Request, res: Response) {
    try {
      const problems = await prismaClient.problem.findMany({
        include: {
          problemTopics: true,
        },
      });
      return res.status(200).json(apiResponse(200, "data fetched", problems));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async getDsaProblemById(req: Request, res: Response) {
    try {
      const problemId = req.params.id;
      if (!problemId) throw new Error("problem id is needed");

      const dbProblem = await prismaClient.problem.findUnique({
        where: { id: problemId },
      });

      if (!dbProblem) throw new Error("db problem not found");

      const data = await prismaClient.problem.findUnique({
        where: { id: dbProblem.id },
        include: {
          testCases: {
            where: {
              testType: "EXAMPLE",
            },
          },
          problemTemplates: true,
          problemTopics: true,
          solution: {
            where: {
              problemId: dbProblem.id,
            },
          },
        },
      });

      return res
        .status(200)
        .json(apiResponse(200, "fetched successfully", data));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  //TODO: implement pagination service
  async getDsaProblemByTag(req: Request, res: Response) {
    try {
      const { tags } = req.body;

      if (!tags || !Array.isArray(tags) || tags.length === 0) {
        throw new Error("At least some tags are needed");
      }

      const problems = await prismaClient.problem.findMany({
        where: {
          problemTopics: {
            some: {
              tagName: {
                hasSome: tags,
              },
            },
          },
        },
        include: {
          problemTopics: true,
        },
      });

      return res.status(200).json(apiResponse(200, "data fetched", problems));
    } catch (error: any) {
      console.log(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  // topic tag creation
  async addTopicToProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;
      const data: string[] = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
        include: {
          problemTopics: true,
        },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");
      if (dbProblem.problemTopics.length > 0) throw new Error("update topics");

      const createdProblemTopic = await prismaClient.problemTopic.create({
        data: {
          problemId: dbProblem.id,
          tagName: data,
        },
      });

      if (!createdProblemTopic) throw new Error("problem not created");

      return res
        .status(200)
        .json(apiResponse(200, "topic registered", createdProblemTopic));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateTopicToProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemTopicId = req.params.id;
      const data: string[] = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!problemTopicId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblemTopic = await prismaClient.problemTopic.findFirst({
        where: { id: problemTopicId },
      });
      if (!dbProblemTopic) throw new Error("problem Topic doesn't exists");

      const updatedProblemTopic = await prismaClient.problemTopic.update({
        where: { id: dbProblemTopic.id },
        data: {
          tagName: data,
        },
      });

      if (!updatedProblemTopic) throw new Error("problem not updated");

      return res
        .status(200)
        .json(apiResponse(200, "topic updated", updatedProblemTopic));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteTopicFromProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemTopicId = req.params.id;

      if (!userId) throw new Error("kindly Login");
      if (!problemTopicId) throw new Error("problemId is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblemTopic = await prismaClient.problemTopic.findFirst({
        where: { id: problemTopicId },
      });
      if (!dbProblemTopic) throw new Error("problem Topic doesn't exists");

      const deletedProblemTopic = await prismaClient.problemTopic.delete({
        where: { id: dbProblemTopic.id },
      });

      if (!deletedProblemTopic) throw new Error("problem not deleted");

      return res
        .status(200)
        .json(apiResponse(200, "topic deleted", deletedProblemTopic));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  // question template
  async addQuestionTemplate(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;
      const data: ProblemTemplate = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
        include: {
          problemTopics: true,
        },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");

      const dbTemplate = await prismaClient.problemTemplate.findFirst({
        where: { problemId: dbProblem.id },
      });

      if (dbTemplate) throw new Error("db Template already exists");

      const createdTemplate = await prismaClient.problemTemplate.create({
        data: {
          functionBody: data.functionBody,
          defaultCode: data.defaultCode,
          problemId: dbProblem.id,
          language: data.language as any,
        },
      });

      if (!createdTemplate) throw new Error("couldnot created tempate");

      return res
        .status(200)
        .json(apiResponse(200, "template added successfully", createdTemplate));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateQuestionTemplate(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;
      const data: UpdateProblemTemplate = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
        include: {
          problemTopics: true,
        },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");

      const dbTemplate = await prismaClient.problemTemplate.findFirst({
        where: { problemId: dbProblem.id },
      });

      if (!dbTemplate) throw new Error("db Template doesn't exists");

      const updatedTemplate = await prismaClient.problemTemplate.update({
        where: { id: dbTemplate.id },
        data: {
          functionBody: data.functionBody ?? dbTemplate.functionBody,
          defaultCode: data.defaultCode ?? dbTemplate.defaultCode,
          language: (data.language as any) ?? dbTemplate.language,
        },
      });

      if (!updatedTemplate) throw new Error("couldnot updated tempate");

      return res
        .status(200)
        .json(
          apiResponse(200, "template updated successfully", updatedTemplate)
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteQuestionTemplate(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
        include: {
          problemTopics: true,
        },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");

      const dbTemplate = await prismaClient.problemTemplate.findFirst({
        where: { problemId: dbProblem.id },
      });

      if (!dbTemplate) throw new Error("db Template doesn't exists");

      const deletedTemplate = await prismaClient.problemTemplate.delete({
        where: { id: dbTemplate.id },
      });

      if (!deletedTemplate) throw new Error("couldnot deleted tempate");

      return res
        .status(200)
        .json(
          apiResponse(200, "template deleted successfully", deletedTemplate)
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  // test-cases
  async addTestCaseToProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;
      const data: ProblemTestCaseBody[] = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
        include: {
          problemTopics: true,
        },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");

      const testCasesWithProblemId = data.map((testcase) => {
        return {
          input: testcase.input,
          output: testcase.output,
          testType: testcase.testType,
          problemId: problemId,
        };
      });
      const createdTestCases = await prismaClient.problemTestCase.createMany({
        data: testCasesWithProblemId,
      });

      if (!createdTestCases) throw new Error("test cases not created");

      return res
        .status(200)
        .json(
          apiResponse(200, "test cases added successfully", createdTestCases)
        );
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateTestCaseToProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const testcaseId = req.params.id;
      const data: UpdatedProblemTestCaseBody = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!testcaseId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbTestcase = await prismaClient.problemTestCase.findFirst({
        where: { id: testcaseId },
      });
      if (!dbTestcase) throw new Error("problem doesn't exists");

      const updatedData = await prismaClient.problemTestCase.update({
        where: { id: dbTestcase.id },
        data: {
          input: data.input ?? dbTestcase.input,
          output: data.output ?? dbTestcase.output,
          testType: data.testType ?? dbTestcase.testType,
        },
      });

      if (!updatedData) throw new Error("could not update data");

      return res
        .status(200)
        .json(apiResponse(200, "updated testcase", updatedData));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async deleteTestCaseToProblem(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const testcaseId = req.params.id;
      const data: UpdatedProblemTestCaseBody = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!testcaseId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbTestcase = await prismaClient.problemTestCase.findFirst({
        where: { id: testcaseId },
      });
      if (!dbTestcase) throw new Error("problem doesn't exists");

      const removeData = await prismaClient.problemTestCase.delete({
        where: { id: dbTestcase.id },
      });

      if (!removeData) throw new Error("could not remove data");

      return res
        .status(200)
        .json(apiResponse(200, "removed testcase", removeData));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }

  // solution
  async addProblemSolution(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;
      const data: ProblemSolution = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
        include: {
          solution: true,
        },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");
      if (dbProblem.solution) throw new Error("solution is already added");

      const createdSolution = await prismaClient.problemSolution.create({
        data: {
          problemId: dbProblem.id,
          videoSolution: data.videoSolution,
          solution: data.solution,
        },
      });

      if (!createdSolution) throw new Error("solution couldnot be added");

      return res
        .status(200)
        .json(apiResponse(200, "solution has been added", createdSolution));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async updateProblemSolution(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;
      const data: ProblemSolution = req.body;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");
      if (!data) throw new Error("data is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
        include: {
          solution: true,
        },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");
      if (!dbProblem.solution) throw new Error("solution is not added");

      const udpatedSolution = await prismaClient.problemSolution.update({
        where: { problemId: dbProblem.id },
        data: {
          videoSolution: data.videoSolution ?? dbProblem.solution.videoSolution,
          solution: data.solution ?? dbProblem.solution.solution,
        },
      });

      if (!udpatedSolution) throw new Error("solution couldnot be udpated");

      return res
        .status(200)
        .json(apiResponse(200, "solution has been udpated", udpatedSolution));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
  async removeProblemSolution(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const problemId = req.params.id;

      if (!userId) throw new Error("kindly Login");
      if (!problemId) throw new Error("problemId is required");

      const dbAdmin = await prismaClient.user.findUnique({
        where: { id: userId },
      });
      if (!dbAdmin) throw new Error("no such admin found!");

      const dbProblem = await prismaClient.problem.findFirst({
        where: { id: problemId },
        include: {
          solution: true,
        },
      });
      if (!dbProblem) throw new Error("problem doesn't exists");
      if (!dbProblem.solution) throw new Error("solution is not added");

      const deletedSolution = await prismaClient.problemSolution.delete({
        where: { problemId: dbProblem.id },
      });

      if (!deletedSolution) throw new Error("solution couldnot be deleted");

      return res
        .status(200)
        .json(apiResponse(200, "solution has been deleted", deletedSolution));
    } catch (error: any) {
      console.log(error);
      return res.status(200).json(apiResponse(500, error.message, null));
    }
  }
}
export default new DsaQuestionController();
