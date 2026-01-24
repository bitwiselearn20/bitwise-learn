"use client";

import { useState } from "react";
import { X } from "lucide-react";

type InputField = {
  key: string;
  value: string;
};

export default function TestCaseForm({
  onClose,
  onSave,
}: {
  onClose?: () => void;
  onSave?: (data: any) => void;
}) {
  const [testCaseType, setTestCaseType] = useState<"EXAMPLE" | "HIDDEN">(
    "EXAMPLE",
  );

  const [inputFields, setInputFields] = useState<InputField[]>([
    { key: "", value: "" },
  ]);

  const [output, setOutput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /* ---------------- INPUT OPS ---------------- */
  const updateField = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const copy = [...inputFields];
    copy[index][field] = value;
    setInputFields(copy);
  };

  const addField = () =>
    setInputFields([...inputFields, { key: "", value: "" }]);

  const removeField = (index: number) =>
    setInputFields(inputFields.filter((_, i) => i !== index));

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    setIsSaving(true);

    const inputObject: Record<string, any> = {};

    inputFields.forEach(({ key, value }) => {
      if (!key) return;
      try {
        inputObject[key] = JSON.parse(value);
      } catch {
        inputObject[key] = value;
      }
    });

    const payload = {
      testType: testCaseType,
      input: JSON.stringify(inputObject),
      output,
    };

    console.log("New Test Case:", payload);

    onSave?.(payload);

    setTimeout(() => {
      setIsSaving(false);
      onClose?.();
    }, 500);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start">
      <div className="bg-neutral-900 w-full max-w-xl mt-16 rounded-lg shadow-xl border border-neutral-800">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-neutral-800">
          <h2 className="text-white font-semibold">Add Test Case</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5 text-sm">
          {/* Type */}
          <div>
            <label className="block text-gray-400 mb-1">Test Case Type</label>
            <select
              value={testCaseType}
              onChange={(e) =>
                setTestCaseType(e.target.value as "EXAMPLE" | "HIDDEN")
              }
              className="w-full bg-neutral-800 px-3 py-2 rounded-md"
            >
              <option value="EXAMPLE">EXAMPLE</option>
              <option value="HIDDEN">HIDDEN</option>
            </select>
          </div>

          {/* Input */}
          <div>
            <p className="text-gray-400 mb-2">Input</p>

            {inputFields.map((field, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={field.key}
                  onChange={(e) => updateField(i, "key", e.target.value)}
                  placeholder="key"
                  className="w-1/3 bg-neutral-800 p-2 rounded-md"
                />
                <input
                  value={field.value}
                  onChange={(e) => updateField(i, "value", e.target.value)}
                  placeholder="value"
                  className="flex-1 bg-neutral-800 p-2 rounded-md font-mono"
                />
                <button
                  onClick={() => removeField(i)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            ))}

            <button onClick={addField} className="text-blue-400 text-xs mt-1">
              + Add Field
            </button>
          </div>

          {/* Output */}
          <div>
            <label className="block text-gray-400 mb-1">Output</label>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={3}
              className="w-full bg-neutral-800 p-2 rounded-md font-mono text-xs"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-neutral-800">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-700 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 bg-green-600 py-2 rounded-md font-semibold disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Test Case"}
          </button>
        </div>
      </div>
    </div>
  );
}
