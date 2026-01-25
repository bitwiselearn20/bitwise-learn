"use client";

import { getAllProblemTestCases } from "@/api/problems/get-all-testcases";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { deleteTestCase } from "@/api/problems/delete-testcase";
import TestCaseForm from "./TestCaseForm";
import { createTestCase } from "@/api/problems/create-testcase";
import { updateProblemTestcase } from "@/api/problems/update-testcase";
import { uploadBatches } from "@/api/batches/create-batches";
import toast from "react-hot-toast";

type TestCase = {
  id: string;
  testType: string;
  input: string;
  output: string;
  problemId: string;
  createdAt: string;
  updatedAt: string;
};

export default function AllTestCases() {
  const param = useParams();
  const problemId = param.id as string;

  const [data, setData] = useState<TestCase[]>([]);
  const [selectedTestCase, setSelectedTestCase] = useState<TestCase | null>(
    null,
  );
  const [showTestCaseForm, setShowTestCaseForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    getAllProblemTestCases(setData, problemId);
  }, [problemId]);

  /* ---------------- CRUD HELPERS ---------------- */
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      toast.loading("Uploading students...", { id: "bulk-upload" });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("batchId", param.id as string);

      await uploadBatches(param.id as string, file, "TESTCASE", null);

      toast.success("Students uploaded successfully", {
        id: "bulk-upload",
      });
    } catch (error) {
      console.error(error);
      toast.error("Bulk upload failed", {
        id: "bulk-upload",
      });
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  const handleAdd = async (payload: any) => {
    const created = await createTestCase(problemId, payload);
    setData((prev) => [...prev, created]);
    setShowTestCaseForm(false);
  };

  const handleUpdate = async (updated: TestCase) => {
    setData((prev) => prev.map((tc) => (tc.id === updated.id ? updated : tc)));
    await updateProblemTestcase(updated.id, updated);
    setSelectedTestCase(updated);
  };

  const handleDelete = async (id: string) => {
    await deleteTestCase(id);
    setData((prev) => prev.filter((tc) => tc.id !== id));
    setSelectedTestCase(null);
  };

  return (
    <div className="relative flex h-full text-gray-300">
      {showTestCaseForm && (
        <TestCaseForm
          onClose={() => setShowTestCaseForm(false)}
          onSave={handleAdd}
        />
      )}
      <input
        type="file"
        accept=".csv,.xlsx,.ods"
        ref={fileInputRef}
        onChange={handleBulkUpload}
        hidden
      />
      {/* TABLE */}
      <div className="flex-1 p-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Test Cases</h2>
          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
            >
              Bulk Upload
            </button>
            <button
              onClick={() => setShowTestCaseForm(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-500"
            >
              Add New Testcase
            </button>
          </div>
        </div>

        <div className="overflow-x-auto border border-neutral-700 rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-neutral-800 text-gray-400">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Input</th>
                <th className="px-4 py-3">Output</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tc, i) => (
                <tr
                  key={tc.id}
                  onClick={() => setSelectedTestCase(tc)}
                  className="cursor-pointer border-t border-neutral-700 hover:bg-neutral-800"
                >
                  <td className="px-4 py-3">{i + 1}</td>
                  <td className="px-4 py-3">{tc.testType}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {truncate(tc.input, 40)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {truncate(tc.output, 40)}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-500">
                    No test cases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDEBAR */}
      {selectedTestCase && (
        <EditableTestCaseSidebar
          testCase={selectedTestCase}
          onClose={() => setSelectedTestCase(null)}
          onSaved={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

function EditableTestCaseSidebar({
  testCase,
  onClose,
  onSaved,
  onDelete,
}: {
  testCase: TestCase;
  onClose: () => void;
  onSaved: (tc: TestCase) => void;
  onDelete: (id: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const parsedInput = (() => {
    try {
      return JSON.parse(testCase.input);
    } catch {
      return {};
    }
  })();

  const [inputFields, setInputFields] = useState(
    Object.entries(parsedInput).map(([k, v]) => ({
      key: k,
      value: Array.isArray(v) ? JSON.stringify(v) : String(v),
    })),
  );

  const [output, setOutput] = useState(testCase.output);

  const handleSave = async () => {
    setIsSaving(true);

    const input: Record<string, any> = {};
    inputFields.forEach(({ key, value }) => {
      try {
        input[key] = JSON.parse(value);
      } catch {
        input[key] = value;
      }
    });

    onSaved({
      ...testCase,
      input: JSON.stringify(input),
      output,
    });

    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-[420px] bg-neutral-900 border-l border-neutral-800 flex flex-col">
      <div className="flex justify-between p-4 border-b border-neutral-800">
        <h3 className="text-white font-semibold">Test Case</h3>
        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto">
        {inputFields.map((f, i) => (
          <div key={i} className="flex gap-2">
            <input
              disabled={!isEditing}
              value={f.key}
              onChange={(e) =>
                setInputFields((prev) =>
                  prev.map((x, idx) =>
                    idx === i ? { ...x, key: e.target.value } : x,
                  ),
                )
              }
              className="w-1/3 bg-neutral-800 p-2 rounded"
            />
            <input
              disabled={!isEditing}
              value={f.value}
              onChange={(e) =>
                setInputFields((prev) =>
                  prev.map((x, idx) =>
                    idx === i ? { ...x, value: e.target.value } : x,
                  ),
                )
              }
              className="flex-1 bg-neutral-800 p-2 rounded font-mono"
            />
          </div>
        ))}

        <textarea
          disabled={!isEditing}
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          className="w-full bg-neutral-800 p-2 rounded font-mono"
        />
      </div>

      <div className="p-4 border-t border-neutral-800 space-y-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 py-2 rounded"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-green-600 py-2 rounded"
          >
            Save
          </button>
        )}

        <button
          onClick={() => onDelete(testCase.id)}
          className="w-full border border-red-700 text-red-400 py-2 rounded hover:bg-red-600 hover:text-white"
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
