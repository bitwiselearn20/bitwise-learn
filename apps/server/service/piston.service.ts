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
        version: VERSION_MAP[language] as string,
        files: [
          {
            name: Date.now().toString() + EXTENSION_MAP,
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
        }
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
        version: VERSION_MAP[language] as string,
        files: [
          {
            name: `${Date.now()}.${EXTENSION_MAP[language]}`,
            content: code,
          },
        ],
        stdin: "",
        args: [],
        compile_timeout: 10000,
        run_timeout: 20000,
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
        }
      );
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
export default new CodeExecution();
