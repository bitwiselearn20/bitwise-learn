export interface language {
  language: string;
  version: string;
  aliases: string[];
}

export type CodeExecutionRequest = {
  language: string;
  version: string;
  files: {
    name: string;
    content: string;
  }[];
  stdin: string;
  args: string[];
  compile_timeout: number;
  run_timeout: number;
  compile_cpu_time: number;
  run_cpu_time: number;
  compile_memory_limit: number;
  run_memory_limit: number;
};
export interface CodeExecutionRunResult {
  stdout: string;
  stderr: string;
  output: string;
  code: number;
  signal: string | null;
  message: string | null;
  status: string | null;
  cpu_time: number;
  wall_time: number;
  memory: number;
}
export interface pistonClient {
  runtimes: () => language[];
  execute: (data: CodeExecutionRequest) => CodeExecutionRunResult;
}

export const VERSION_MAP: Record<string, string> = {
  matl: "22.5.0",
  bash: "5.2.0",
  cobal: "3.1.2",
  dart: "2.19.6",
  dash: "0.5.11",
  csharp: "6.12.0",
  elixir: "1.11.3",
  c: "10.2.0",
  "c++": "10.2.0",
  java: "15.0.2",
  javascript: "20.11.1",
  python: "3.10.0",
  rust: "1.68.2",
};
export const EXTENSION_MAP: Record<string, string> = {
  javascript: "js",
  python: "py",
  bash: "sh",
  c: "c",
  "c++": "cpp",
  csharp: "cs",
  java: "java",
  rust: "rs",
  dart: "dart",
  elixir: "exs",
  matl: "m", // MATLAB
  cobal: "cob", // COBOL
  dash: "py", // Dash apps are Python-based
};

export const CHOSEN_LANGUAGES = [
  {
    language: "matl",
    version: "22.5.0",
    aliases: [],
  },
  {
    language: "bash",
    version: "5.2.0",
    aliases: ["sh"],
  },
  {
    language: "cobol",
    version: "3.1.2",
    aliases: ["cob"],
  },
  {
    language: "dart",
    version: "2.19.6",
    aliases: [],
  },
  {
    language: "dash",
    version: "0.5.11",
    aliases: ["dash"],
  },
  {
    language: "elixir",
    version: "1.11.3",
    aliases: ["elixir", "exs"],
  },
  {
    language: "c",
    version: "10.2.0",
    aliases: ["gcc"],
    runtime: "gcc",
  },
  {
    language: "c++",
    version: "10.2.0",
    aliases: ["cpp", "g++"],
    runtime: "gcc",
  },
  {
    language: "java",
    version: "15.0.2",
    aliases: [],
  },
  {
    language: "csharp",
    version: "6.12.0",
    aliases: ["mono", "mono-csharp", "mono-c#", "mono-cs", "c#", "cs"],
    runtime: "mono",
  },
  {
    language: "javascript",
    version: "18.15.0",
    aliases: ["node-javascript", "node-js", "javascript", "js"],
    runtime: "node",
  },
  {
    language: "python",
    version: "3.10.0",
    aliases: ["py", "py3", "python3", "python3.10"],
  },
  {
    language: "rust",
    version: "1.68.2",
    aliases: ["rs"],
  },
];
