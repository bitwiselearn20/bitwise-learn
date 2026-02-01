"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useColors } from "@/component/general/(Color Manager)/useColors";

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
  const Colors = useColors();

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

    ("New Test Case:", payload);

    onSave?.(payload);

    setTimeout(() => {
      setIsSaving(false);
      onClose?.();
    }, 500);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start">
      <div className={`${Colors.background.secondary} w-full max-w-xl mt-16 rounded-lg shadow-xl`}>
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3">
          <h2 className={` font-semibold ${Colors.text.primary}`}>Add Test Case</h2>
          <button onClick={onClose} className={`${Colors.text.primary} hover:text-red-500 cursor-pointer active:scale-95 transition-all`}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5 text-sm">
          {/* Type */}
          <div>
            <label className={`block ${Colors.text.secondary} mb-1`}>Test Case Type</label>
            <select
              value={testCaseType}
              onChange={(e) =>
                setTestCaseType(e.target.value as "EXAMPLE" | "HIDDEN")
              }
              className={`w-full  px-3 py-2 rounded-md ${Colors.background.primary} ${Colors.text.secondary} cursor-pointer`}
            >
              <option className="cursor-pointer" value="EXAMPLE">EXAMPLE</option>
              <option className="cursor-pointer" value="HIDDEN">HIDDEN</option>
            </select>
          </div>

          {/* Input */}
          <div>
            <p className={`mb-2 ${Colors.text.secondary}`}>Input</p>

            {inputFields.map((field, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={field.key}
                  onChange={(e) => updateField(i, "key", e.target.value)}
                  placeholder="Key"
                  className={`w-1/3 p-2 rounded-md ${Colors.background.primary} ${Colors.text.secondary} placeholder:text-neutral-500`}
                />
                <input
                  value={field.value}
                  onChange={(e) => updateField(i, "value", e.target.value)}
                  placeholder="Value"
                  className={`flex-1 p-2 rounded-md ${Colors.background.primary} ${Colors.text.secondary} placeholder:text-neutral-500`}
                />
                <button
                  onClick={() => removeField(i)}
                  className="text-red-500 hover:text-red-300 cursor-pointer active:scale-95 transition-all"
                >
                  <X size={16} />
                </button>
              </div>
            ))}

            <button onClick={addField} className={`${Colors.text.special} text-xs mt-1 hover:underline cursor-pointer active:scale-95 transition-all`}>
              + Add Field
            </button>
          </div>

          {/* Output */}
          <div>
            <label className={`block mb-1 ${Colors.text.secondary}`}>Output</label>
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={3}
              className={`w-full p-2 rounded-md font-mono text-xs ${Colors.background.primary} ${Colors.text.secondary} placeholder:text-neutral-500`}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4">
          <button
            onClick={onClose}
            className={`flex-1 py-2 rounded-md ${Colors.text.special} hover:underline cursor-pointer active:scale-95 transition-all`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 py-2 rounded-md font-semibold disabled:opacity-50 ${Colors.text.primary} ${Colors.background.special} ${Colors.hover.special} cursor-pointer active:scale-95 transition-all`}
          >
            {isSaving ? "Saving..." : "Save Test Case"}
          </button>
        </div>
      </div>
    </div>
  );
}
