import type { Request, Response } from "express";
import CodeExecution from "../service/piston.service";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";

function normalizeOutput(output: any): string {
  if (output === null || output === undefined) return "";
  return output.toString().trim().replace(/\s+/g, "");
}

function classifyExecutionResult(result: any): {
  verdict: string;
  message: string;
} {
  const stderr = result?.run?.stderr || "";
  const signal = result?.run?.signal || "";
  const status = result?.run?.status || "";

  if (status === "TLE" || signal === "SIGKILL") {
    return { verdict: "TIME_LIMIT_EXCEEDED", message: "Time Limit Exceeded" };
  }

  if (stderr.toLowerCase().includes("memory")) {
    return {
      verdict: "MEMORY_LIMIT_EXCEEDED",
      message: "Memory Limit Exceeded",
    };
  }

  if (stderr.toLowerCase().includes("compile")) {
    return { verdict: "COMPILATION_ERROR", message: "Compilation Error" };
  }

  if (stderr) {
    return { verdict: "RUNTIME_ERROR", message: "Runtime Error" };
  }

  return { verdict: "SUCCESS", message: "Success" };
}

class CodeRunnerController {
  async runCode(req: Request, res: Response) {
    try {
      const { language, code, questionId } = req.body;

      if (!language || !code || !questionId) {
        throw new Error("missing required field");
      }

      const dbProblem = await prismaClient.problem.findUnique({
        where: { id: questionId },
      });
      if (!dbProblem) throw new Error("no such problem found");

      const exampleTestCases = await prismaClient.problemTestCase.findMany({
        where: {
          problemId: dbProblem.id,
          testType: "EXAMPLE",
        },
      });

      const dbTemplate = await prismaClient.problemTemplate.findFirst({
        where: {
          language: language.toUpperCase() as any,
          problemId: dbProblem.id,
        },
      });
      if (!dbTemplate) throw new Error("template not supported yet");

      const executionCode = dbTemplate.functionBody.replace("_solution_", code);

      const outputArray: any[] = [];
      let allPassed = true;

      for (const testcase of exampleTestCases) {
        const result = await CodeExecution.compileDsaProblem(
          executionCode,
          language,
          testcase.input,
        );

        const execStatus = classifyExecutionResult(result);
        const actualOutput = normalizeOutput(result?.run?.stdout);
        const expectedOutput = normalizeOutput(testcase.output);

        const isCorrect =
          execStatus.verdict === "SUCCESS" && actualOutput === expectedOutput;

        if (!isCorrect) allPassed = false;

        outputArray.push({
          input: testcase.input,
          expectedOutput: testcase.output,
          actualOutput: result?.run?.stdout || "",
          stderr: result?.run?.stderr || "",
          isCorrect,
        });
      }
      if (
        (req.user?.type === "ADMIN" || req.user?.type === "SUPERADMIN") &&
        allPassed
      ) {
        console.log("executing code");
        const hiddenTestCases = await prismaClient.problemTestCase.findMany({
          where: {
            problemId: dbProblem.id,
            testType: "HIDDEN",
          },
        });

        for (const testcase of hiddenTestCases) {
          const result = await CodeExecution.compileDsaProblem(
            executionCode,
            language,
            testcase.input,
          );

          const execStatus = classifyExecutionResult(result);
          const actualOutput = normalizeOutput(result?.run?.stdout);
          const expectedOutput = normalizeOutput(testcase.output);

          const isCorrect =
            execStatus.verdict === "SUCCESS" && actualOutput === expectedOutput;
          console.log("hidden testcase is correct or not : ", isCorrect);

          if (!isCorrect) {
            allPassed = false;
            outputArray.push({
              input: testcase.input,
              expectedOutput: testcase.output,
              actualOutput: result?.run?.stdout || "",
              stderr: result?.run?.stderr || "",
              isCorrect: false,
            });
            break;
          }
        }
      }

      console.log(outputArray);
      return res.status(200).json(
        apiResponse(200, "success", {
          allPassed,
          testCases: outputArray,
        }),
      );
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  async submitCode(req: Request, res: Response) {
    try {
      const { language, code, questionId } = req.body;
      const userId = req.user?.id;

      if (!language || !code || !questionId) {
        throw new Error("missing required field");
      }

      if (!userId) throw new Error("no user id found");

      let dbUser;
      if (req.user?.type === "STUDENT") {
        dbUser = await prismaClient.student.findUnique({
          where: { id: userId },
        });
      } else {
        dbUser = await prismaClient.teacher.findUnique({
          where: { id: userId },
        });
      }
      if (!dbUser) throw new Error("no user found");

      const dbProblem = await prismaClient.problem.findUnique({
        where: { id: questionId },
      });
      if (!dbProblem) throw new Error("no such problem found");

      const dbTemplate = await prismaClient.problemTemplate.findFirst({
        where: {
          language: language.toUpperCase(),
          problemId: dbProblem.id,
        },
      });
      if (!dbTemplate) throw new Error("template not supported yet");

      const executionCode = dbTemplate.functionBody.replace("_solution_", code);

      const allTestCases = await prismaClient.problemTestCase.findMany({
        where: { problemId: dbProblem.id },
      });

      const submission = await prismaClient.problemSubmission.create({
        data: {
          problemId: dbProblem.id,
          studentId: dbUser.id,
          code,
          status: "SUCCESS",
        },
      });

      let finalVerdict: "SUCCESS" | "FAILED" = "SUCCESS";
      let verdictMessage = "All test cases passed";
      let maxRuntime = 0;
      let maxMemory = 0;

      const outputArray: any[] = [];

      for (const testcase of allTestCases) {
        const result = await CodeExecution.compileDsaProblem(
          executionCode,
          language,
          testcase.input,
        );

        const runtime = result?.run?.time ?? 0;
        const memory = result?.run?.memory ?? 0;

        maxRuntime = Math.max(maxRuntime, runtime);
        maxMemory = Math.max(maxMemory, memory);

        const execStatus = classifyExecutionResult(result);
        const actualOutput = normalizeOutput(result?.run?.stdout);
        const expectedOutput = normalizeOutput(testcase.output);

        const passed =
          execStatus.verdict === "SUCCESS" && actualOutput === expectedOutput;

        if (!passed) {
          finalVerdict = "FAILED";
          verdictMessage =
            execStatus.verdict === "SUCCESS"
              ? "Wrong Answer"
              : execStatus.message;

          await prismaClient.problemSubmission.update({
            where: { id: submission.id },
            data: {
              failedTestCase: JSON.stringify({
                input: testcase.input,
                output: testcase.output,
                yourOutput: result?.run?.stdout || "",
                stderr: result?.run?.stderr || "",
              }),
            },
          });

          break; // stop at first failure
        }

        await prismaClient.problemSubmissionTestCase.create({
          data: {
            submissionId: submission.id,
            testCaseId: testcase.id,
            passed,
            actualOutput: result?.run?.stdout || "",
            runtime: `${Math.round(runtime * 1000)} ms`,
            memory: `${(memory / (1024 * 1024)).toFixed(2)} MB`,
          },
        });

        if (testcase.testType === "EXAMPLE") {
          outputArray.push({
            input: testcase.input,
            expectedOutput: testcase.output,
            actualOutput: result?.run?.stdout || "",
            stderr: result?.run?.stderr || "",
            isCorrect: passed,
          });
        }
      }

      await prismaClient.problemSubmission.update({
        where: { id: submission.id },
        data: {
          status: finalVerdict,
          runtime: `${Math.round(maxRuntime * 1000)} ms`,
          memory: `${(maxMemory / (1024 * 1024)).toFixed(2)} MB`,
        },
      });

      return res.status(200).json(
        apiResponse(200, finalVerdict, {
          verdict: finalVerdict,
          message: verdictMessage,
          testCases: outputArray,
        }),
      );
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  async compileCode(req: Request, res: Response) {
    try {
      const { language, code, input } = req.body;

      if (!language || !code) {
        throw new Error("missing required field");
      }

      const result = await CodeExecution.compileCompilerCode(
        code,
        language,
        input,
      );

      return res.status(200).json(apiResponse(200, "success", result));
    } catch (error: any) {
      console.error(error);
      return res.status(500).json(apiResponse(500, error.message, null));
    }
  }

  async runTestCode(id: string, code: string, language: string) {
    try {
      if (!language || !code || !id) {
        throw new Error("missing required field");
      }

      const dbProblem = await prismaClient.problem.findUnique({
        where: { id },
      });
      if (!dbProblem) throw new Error("no such problem found");

      const dbTemplate = await prismaClient.problemTemplate.findFirst({
        where: {
          language: language.toUpperCase() as any,
          problemId: dbProblem.id,
        },
      });
      if (!dbTemplate) throw new Error("template not supported yet");

      const executionCode = dbTemplate.functionBody.replace("_solution_", code);

      const exampleTestCases = await prismaClient.problemTestCase.findMany({
        where: { problemId: dbProblem.id, testType: "EXAMPLE" },
      });

      const hiddenTestCases = await prismaClient.problemTestCase.findMany({
        where: { problemId: dbProblem.id, testType: "HIDDEN" },
      });

      let correct = 0;

      for (const testcase of exampleTestCases) {
        const result = await CodeExecution.compileDsaProblem(
          executionCode,
          language,
          testcase.input,
        );

        const execStatus = classifyExecutionResult(result);
        const actualOutput = normalizeOutput(result?.run?.stdout);
        const expectedOutput = normalizeOutput(testcase.output);

        if (
          execStatus.verdict === "SUCCESS" &&
          actualOutput === expectedOutput
        ) {
          correct++;
        }
      }

      for (const testcase of hiddenTestCases) {
        const result = await CodeExecution.compileDsaProblem(
          executionCode,
          language,
          testcase.input,
        );

        const execStatus = classifyExecutionResult(result);
        if (execStatus.verdict !== "SUCCESS") break;

        const actualOutput = normalizeOutput(result?.run?.stdout);
        const expectedOutput = normalizeOutput(testcase.output);

        if (actualOutput !== expectedOutput) break;

        correct++;
      }

      return {
        passed: correct,
        wrong: exampleTestCases.length + hiddenTestCases.length - correct,
      };
    } catch (error: any) {
      console.error(error);
      return null;
    }
  }
}

export default new CodeRunnerController();
