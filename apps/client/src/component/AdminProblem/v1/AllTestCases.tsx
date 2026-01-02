"use client";

import { getAllProblemTestCases } from "@/api/problems/get-all-testcases";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { deleteTestCase } from "@/api/problems/delete-testcase";
import TestCaseForm from "./TestCaseForm";

type TestCase = {
  id: string;
  testType: string;
  input: string;
  output: string;
  problemId: string;
  createdAt: string;
  updatedAt: string;
};

function AllTestCases() {
  const param = useParams();
  const [data, setData] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(
    null
  );
  const [showTestCaseForm, setShowTestCase] = useState(false);
  useEffect(() => {
    getAllProblemTestCases(setData, param.id as string);
  }, [param.id]);

  return (
    <div className="relative flex h-full text-gray-300">
      {/* TABLE */}
      <div>{showTestCaseForm && <TestCaseForm />}</div>
      <div className="flex-1 p-4">
        <div className="flex  justify-between">
          <h2 className="text-lg font-semibold text-white mb-4">Test Cases</h2>
          <button
            onClick={() => setShowTestCase(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 active:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900"
          >
            Add New Testcases
          </button>
        </div>
        <div className="overflow-x-auto border border-neutral-700 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-neutral-800 text-gray-400">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Input</th>
                <th className="px-4 py-3 text-left">Output</th>
              </tr>
            </thead>

            <tbody>
              {data.map((testCase, index) => (
                <tr
                  key={testCase.id}
                  onClick={() => setSelectedTestCase(testCase)}
                  className="cursor-pointer border-t border-neutral-700 hover:bg-neutral-800 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 text-xs rounded-md bg-neutral-700 text-gray-300">
                      {testCase.testType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {truncate(testCase.input, 40)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-400">
                    {truncate(testCase.output, 40)}
                  </td>
                </tr>
              ))}

              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No test cases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      {selectedTestCase && (
        <div className="fixed right-0 top-0 h-screen w-95 bg-neutral-900 border-l border-neutral-800 shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <h3 className="text-sm font-semibold text-white">
              Test Case Details
            </h3>
            <button
              onClick={() => setSelectedTestCase(null)}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 overflow-y-auto text-sm">
            <Detail label="ID" value={selectedTestCase.id} />
            <Detail label="Test Type" value={selectedTestCase.testType} />
            <Detail label="Problem ID" value={selectedTestCase.problemId} />
            <Detail
              label="Created At"
              value={new Date(selectedTestCase.createdAt).toLocaleString()}
            />
            <DetailJSON label="Input" value={selectedTestCase.input} />
            <div>
              <p className="text-xs text-gray-500 mb-1">output</p>
              <pre className="bg-neutral-800 border border-neutral-700 rounded-md p-3 text-xs font-mono text-gray-300 overflow-x-auto">
                {selectedTestCase.output}
              </pre>
            </div>

            <button
              onClick={() => deleteTestCase(selectedTestCase.id)}
              className=" w-full p-3 border-2 rounded-md bottom-10 border-red-800"
            >
              Delete TestCase
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllTestCases;
function truncate(text: string, length: number) {
  return text.length > length ? text.slice(0, length) + "…" : text;
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-gray-300 break-all">{value}</p>
    </div>
  );
}

function DetailJSON({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      {/* <pre className="bg-neutral-800 border border-neutral-700 rounded-md p-3 text-xs font-mono text-gray-300 overflow-x-auto">
        {JSON.stringify(JSON.parse(value), null, 2)}
      </pre> */}

      {Object.entries(JSON.parse(value)).map(([key, value], idx) => (
        <div key={idx} className="text-[#facc15]">
          <span className="font-medium text-gray-300">{key}</span>
          {" : "}
          <span>
            {Array.isArray(value) ? JSON.stringify(value) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}
