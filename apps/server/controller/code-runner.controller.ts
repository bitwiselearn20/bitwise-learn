import type { Request, Response } from "express";
import CodeExecution from "../service/piston.service";
import apiResponse from "../utils/apiResponse";
import prismaClient from "../utils/prisma";
function normalizeOutput(output: any): string {
  if (output === null || output === undefined) return "";

  return output.toString().trim().replace(/\s+/g, ""); // removes extra spaces & newlines
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
          language: language.toUpperCase(),
          problemId: dbProblem.id,
        },
      });
      if (!dbTemplate) throw new Error("template not supported yet");

      let executionCode = dbTemplate.functionBody.replace("_solution_", code);

      const outputArray: any[] = [];
      let allPassed = true;

      for (const testcase of exampleTestCases) {
        let testrun = executionCode;
        const input = JSON.parse(testcase.input as string);

        Object.keys(input).forEach((key) => {
          testrun = testrun.replace(`input_${key}`, `${input[key]}`);
        });

        const result = await CodeExecution.compileDsaProblem(testrun, language);
        console.log(result);
        const hasRuntimeError =
          result?.run?.stderr && result.run.stderr.length > 0;

        const actualOutput = normalizeOutput(result?.run?.output);
        const expectedOutput = normalizeOutput(testcase.output);

        const isCorrect = !hasRuntimeError && actualOutput === expectedOutput;

        if (!isCorrect) allPassed = false;

        console.log({
          input: testcase.input,
          expectedOutput: testcase.output,
          actualOutput: result?.run?.stdout || "",
          stderr: result?.run?.stderr || "",
          isCorrect,
        });

        outputArray.push({
          input: testcase.input,
          expectedOutput: testcase.output,
          actualOutput: result?.run?.stdout || "",
          stderr: result?.run?.stderr || "",
          isCorrect,
        });
      }

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

      const dbUser = await prismaClient.student.findUnique({
        where: { id: userId },
      });
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

      const exampleTestCases = await prismaClient.problemTestCase.findMany({
        where: { problemId: dbProblem.id, testType: "EXAMPLE" },
      });

      const hiddenTestCases = await prismaClient.problemTestCase.findMany({
        where: { problemId: dbProblem.id, testType: "HIDDEN" },
      });

      const outputArray: any[] = [];
      let finalVerdict: "SUCCESS" | "FAILED" = "SUCCESS";
      let verdictMessage = "All test cases passed";
      let maxRuntime = 0; // seconds
      let maxMemory = 0; // bytes

      // ---- Run Example Testcases (for feedback)
      for (const testcase of exampleTestCases) {
        let testrun = executionCode;
        const input = JSON.parse(testcase.input as string);

        Object.keys(input).forEach((key) => {
          testrun = testrun.replace(`input_${key}`, `${input[key]}`);
        });

        const result = await CodeExecution.compileDsaProblem(testrun, language);
        const runtime = result?.run?.time ?? 0;
        const memory = result?.run?.memory ?? 0;

        maxRuntime = Math.max(maxRuntime, runtime);
        maxMemory = Math.max(maxMemory, memory);

        const execStatus = classifyExecutionResult(result);

        const actualOutput = normalizeOutput(result?.run?.stdout);
        const expectedOutput = normalizeOutput(testcase.output);

        const isCorrect =
          execStatus.verdict === "SUCCESS" && actualOutput === expectedOutput;

        outputArray.push({
          input: testcase.input,
          expectedOutput: testcase.output,
          actualOutput: result?.run?.stdout || "",
          stderr: result?.run?.stderr || "",
          isCorrect,
        });
      }
      let wrongTestCase: any;
      // ---- Run Hidden Testcases (for verdict)
      for (const testcase of hiddenTestCases) {
        let testrun = executionCode;
        const input = JSON.parse(testcase.input as string);

        Object.keys(input).forEach((key) => {
          testrun = testrun.replace(`input_${key}`, `${input[key]}`);
        });

        const result = await CodeExecution.compileCode(testrun, language);
        const execStatus = classifyExecutionResult(result);

        if (execStatus.verdict !== "SUCCESS") {
          finalVerdict = "FAILED";
          verdictMessage = execStatus.message;
          break;
        }

        const actualOutput = normalizeOutput(result?.run?.stdout);
        const expectedOutput = normalizeOutput(testcase.output);

        if (actualOutput !== expectedOutput) {
          finalVerdict = "FAILED";
          verdictMessage = "Wrong Answer";
          wrongTestCase = { ...testcase, yourOutput: actualOutput };
          break;
        }
      }
      const runtimeMs = Math.round(maxRuntime * 1000);
      const memoryMb = (maxMemory / (1024 * 1024)).toFixed(2);

      // ---- Store Submission (ALWAYS)
      await prismaClient.problemSubmission.create({
        data: {
          problemId: dbProblem.id,
          studentId: dbUser.id,
          code,
          status: finalVerdict,
          failedTestCase: JSON.stringify(wrongTestCase),
          runtime: `${runtimeMs} ms`,
          memory: `${memoryMb} MB`,
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
      console.log(input);
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
      const questionId = id;

      if (!language || !code || !questionId) {
        throw new Error("missing required field");
      }

      const dbProblem = await prismaClient.problem.findUnique({
        where: { id: questionId },
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
      let wrong = 0;

      // ---- Run Example Testcases (for feedback)
      for (const testcase of exampleTestCases) {
        let testrun = executionCode;
        const input = JSON.parse(testcase.input as string);

        Object.keys(input).forEach((key) => {
          testrun = testrun.replace(`input_${key}`, `${input[key]}`);
        });

        const result = await CodeExecution.compileDsaProblem(testrun, language);

        const execStatus = classifyExecutionResult(result);

        const actualOutput = normalizeOutput(result?.run?.stdout);
        const expectedOutput = normalizeOutput(testcase.output);

        const isCorrect =
          execStatus.verdict === "SUCCESS" && actualOutput === expectedOutput;

        if (isCorrect) {
          correct++;
        } else {
          wrong++;
        }
      }
      let wrongTestCase: any;
      // ---- Run Hidden Testcases (for verdict)
      for (const testcase of hiddenTestCases) {
        let testrun = executionCode;
        const input = JSON.parse(testcase.input as string);

        Object.keys(input).forEach((key) => {
          testrun = testrun.replace(`input_${key}`, `${input[key]}`);
        });

        const result = await CodeExecution.compileCode(testrun, language);
        const execStatus = classifyExecutionResult(result);

        if (execStatus.verdict !== "SUCCESS") {
          break;
        }

        const actualOutput = normalizeOutput(result?.run?.stdout);
        const expectedOutput = normalizeOutput(testcase.output);

        if (actualOutput !== expectedOutput) {
          wrongTestCase = { ...testcase, yourOutput: actualOutput };
          break;
        } else {
          correct++;
        }
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
