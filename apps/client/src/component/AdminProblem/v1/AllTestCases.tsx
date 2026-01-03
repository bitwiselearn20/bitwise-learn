"use client";

import { getAllProblemTestCases } from "@/api/problems/get-all-testcases";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { deleteTestCase } from "@/api/problems/delete-testcase";
import TestCaseForm from "./TestCaseForm";
import { createTestCase } from "@/api/problems/create-testcase";

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
      <div>
        {showTestCaseForm && (
          <TestCaseForm
            onClose={() => setShowTestCase(false)}
            onSave={(data) => createTestCase(param.id as string, data)}
          />
        )}
      </div>
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
        <EditableTestCaseSidebar
          testCase={selectedTestCase}
          onClose={() => setSelectedTestCase(null)}
          onSaved={(updated) => {
            setData((prev) =>
              prev.map((tc) => (tc.id === updated.id ? updated : tc))
            );
            setSelectedTestCase(updated);
          }}
        />
      )}
    </div>
  );
}

export default AllTestCases;

function EditableTestCaseSidebar({
  testCase,
  onClose,
  onSaved,
}: {
  testCase: TestCase;
  onClose: () => void;
  onSaved: (tc: TestCase) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [inputFields, setInputFields] = useState<
    { key: string; value: string }[]
  >(() =>
    Object.entries(JSON.parse(testCase.input)).map(([k, v]) => ({
      key: k,
      value: Array.isArray(v) ? JSON.stringify(v) : String(v),
    }))
  );

  const [output, setOutput] = useState(testCase.output);

  /* ---------------- INPUT FIELD OPS ---------------- */
  const updateField = (i: number, field: "key" | "value", value: string) => {
    const copy = [...inputFields];
    copy[i][field] = value;
    setInputFields(copy);
  };

  const addField = () =>
    setInputFields([...inputFields, { key: "", value: "" }]);

  const removeField = (i: number) =>
    setInputFields(inputFields.filter((_, idx) => idx !== i));

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    setIsSaving(true);

    const inputObj: Record<string, any> = {};
    inputFields.forEach(({ key, value }) => {
      try {
        inputObj[key] = JSON.parse(value);
      } catch {
        inputObj[key] = value;
      }
    });

    const updated = {
      ...testCase,
      input: JSON.stringify(inputObj),
      output,
    };

    // await updateTestCase(updated); 👈 hook API here
    onSaved(updated);

    setIsSaving(false);
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setInputFields(
      Object.entries(JSON.parse(testCase.input)).map(([k, v]) => ({
        key: k,
        value: Array.isArray(v) ? JSON.stringify(v) : String(v),
      }))
    );
    setOutput(testCase.output);
    setIsEditing(false);
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-[420px] bg-neutral-900 border-l border-neutral-800 z-50 flex flex-col">
      {/* Header */}
      <div className="flex justify-between px-4 py-3 border-b border-neutral-800">
        <h3 className="text-white font-semibold">Test Case</h3>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 overflow-y-auto text-sm">
        <Detail label="ID" value={testCase.id} />
        <Detail label="Type" value={testCase.testType} />

        {/* INPUT */}
        <div>
          <p className="text-xs text-gray-500 mb-2">Input</p>

          {inputFields.map((f, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                disabled={!isEditing}
                value={f.key}
                onChange={(e) => updateField(i, "key", e.target.value)}
                className="w-1/3 bg-neutral-800 p-2 rounded"
                placeholder="key"
              />
              <input
                disabled={!isEditing}
                value={f.value}
                onChange={(e) => updateField(i, "value", e.target.value)}
                className="flex-1 bg-neutral-800 p-2 rounded font-mono"
                placeholder="value"
              />
              {isEditing && (
                <button onClick={() => removeField(i)} className="text-red-400">
                  ✕
                </button>
              )}
            </div>
          ))}

          {isEditing && (
            <button onClick={addField} className="text-blue-400 text-xs mt-1">
              + Add Field
            </button>
          )}
        </div>

        {/* OUTPUT */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Output</p>
          {isEditing ? (
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              className="w-full bg-neutral-800 p-2 rounded font-mono text-xs"
              rows={3}
            />
          ) : (
            <pre className="bg-neutral-800 p-3 rounded text-xs">{output}</pre>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-800 flex flex-col gap-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 py-2 rounded"
          >
            Edit
          </button>
        ) : (
          <>
            <button
              onClick={cancelEdit}
              className="flex-1 bg-neutral-700 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-green-600 py-2 rounded"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </>
        )}

        <button
          onClick={() => deleteTestCase(testCase.id)}
          className=" w-full px-4 py-2 rounded-md border border-red-700 text-red-400 font-medium transition hover:bg-red-600 hover:text-white hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900 active:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

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
