export default function TestCaseSection({ testCases }: { testCases: any[] }) {
  if (!testCases || testCases.length === 0) return null;

  const parseInput = (input: string) => {
    try {
      return JSON.parse(input);
    } catch {
      return {};
    }
  };

  return (
    <div>
      <div className="space-y-4">
        {testCases.map((test: any, index: number) => {
          const parsedInput = parseInput(test.input);

          return (
            <div
              key={test.id}
              className="bg-neutral-800 border border-neutral-700 rounded-lg p-4"
            >
              <p className="text-sm text-gray-400 mb-2">
                {test.testType} {index + 1}
              </p>

              {/* Input */}
              <div className="text-sm space-y-2">
                <div>
                  <span className="font-medium text-gray-200">Input:</span>
                  <div className="mt-1 space-y-1">
                    {Object.entries(parsedInput).map(([key, value], idx) => (
                      <div key={idx} className="text-[#facc15]">
                        <span className="font-medium text-gray-300">{key}</span>
                        {" : "}
                        <span>
                          {Array.isArray(value)
                            ? JSON.stringify(value)
                            : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Output */}
                <div>
                  <span className="font-medium text-gray-200">Output:</span>{" "}
                  <code className="text-[#facc15]">{test.output}</code>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
