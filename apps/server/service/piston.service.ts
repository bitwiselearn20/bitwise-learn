import axios from "axios";
import {
  EXTENSION_MAP,
  VERSION_MAP,
  type CodeExecutionRequest,
  type CodeExecutionRunResult,
  type pistonClient,
} from "../utils/piston";

class CodeExecution {
  client: string | null;
  constructor() {
    this.client = process.env.CODE_EXECUTION_SERVER || "";
  }
  async compileCode(code: string, language: string, options?: object) {
    try {
      if (this.client === null) {
        throw new Error("the client wasn't initialized properly");
      }

      const executionObject: CodeExecutionRequest = {
        language,
        version: "*",
        files: [
          {
            name:
              language === "java"
                ? "CodeRunner.java"
                : Date.now().toString() + EXTENSION_MAP,
            content: code,
          },
        ],
        stdin: "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_cpu_time: 10000,
        run_cpu_time: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      };
      const result = await axios.post(
        this.client + "api/v2/execute",
        executionObject,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async compileDsaProblem(code: string, language: string) {
    try {
      if (this.client === null) {
        throw new Error("the client wasn't initialized properly");
      }

      const executionObject: CodeExecutionRequest = {
        language,
        version: "*",
        files: [
          {
            name:
              language === "java"
                ? "CodeRunner.java"
                : Date.now().toString() + EXTENSION_MAP,
            content: code,
          },
        ],
        stdin: "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_cpu_time: 10000,
        run_cpu_time: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      };

      const result = await axios.post(
        this.client + "api/v2/execute",
        executionObject,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(JSON.stringify(result.data, null, 2));
      return result.data;
    } catch (error: any) {
      console.log(error.message);
      throw error;
      return null;
    }
  }
  async compileTestQuestion(code: string, language: string) {
    try {
      if (this.client === null) {
        throw new Error("the client wasn't initialized properly");
      }

      const executionObject: CodeExecutionRequest = {
        language,
        version: "*",
        files: [
          {
            name:
              language === "java"
                ? "CodeRunner.java"
                : Date.now().toString() + EXTENSION_MAP,
            content: code,
          },
        ],
        stdin: "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_cpu_time: 10000,
        run_cpu_time: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      };

      const result = await axios.post(
        this.client + "api/v2/execute",
        executionObject,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(JSON.stringify(result.data, null, 2));
      return result.data;
    } catch (error: any) {
      console.log(error.message);
      throw error;
      return null;
    }
  }
  async compileCompilerCode(
    code: string,
    language: string,
    input: string,
    options?: object,
  ) {
    try {
      if (this.client === null) {
        throw new Error("the client wasn't initialized properly");
      }

      const executionObject: CodeExecutionRequest = {
        language,
        version: "*",
        files: [
          {
            name:
              language === "java"
                ? "CodeRunner.java"
                : language === "rust"
                  ? "main.rs"
                  : Date.now().toString() + EXTENSION_MAP,
            content: code,
          },
        ],
        stdin:
          typeof input === "string" ? input.trimEnd() : String(input ?? ""),
        args: [],
        compile_timeout: 10000,
        run_timeout: 3000,
        compile_cpu_time: 10000,
        run_cpu_time: 3000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      };
      const result = await axios.post(
        this.client + "api/v2/execute",
        executionObject,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export default new CodeExecution();
