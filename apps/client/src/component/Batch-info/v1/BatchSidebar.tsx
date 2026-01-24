"use client";

import { useEffect, useState } from "react";
import { Pencil, Save, X, Trash } from "lucide-react";
import InfoBlock from "./InfoBlock";
import { updateEntity, deleteEntity } from "@/api/institutions/entity";
import { useRouter } from "next/navigation";

type BatchSidebarProps = {
  batch: any;
};

const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();

  const getOrdinalSuffix = (n: number): string => {
    if (n > 3 && n < 21) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) => (
  <div className="space-y-1">
    <label className="text-xs text-gray-400">{label}</label>
    <input
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  </div>
);

const BatchSidebar = ({ batch }: BatchSidebarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(batch);
  const router = useRouter();
  useEffect(() => {
    setFormData(batch);
  }, [batch]);

  if (!batch) return null;

  const formattedDate = batch.createdAt ? formatDate(batch.createdAt) : "";

  const studentCount = batch?.students?.length ?? 0;

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    await updateEntity(
      formData.id,
      {
        entity: "batch",
        data: formData,
      },
      null,
    );
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this batch?")) {
      await deleteEntity(
        formData.id,
        {
          entity: "batch",
          data: "",
        },
        null,
      );
      router.push("/admin-dashboard/batches");
    }
  };

  return (
    <aside className="w-[320px] bg-[#1b1b1b] text-white p-6 rounded-xl min-h-[93vh]">
      {/* Header */}
      <div className="mb-4">
        {isEditing ? (
          <InputField
            label="Batch Name"
            value={formData.batchname}
            onChange={(v) => handleChange("batchname", v)}
          />
        ) : (
          <h1 className="text-2xl font-semibold">{batch.batchname}</h1>
        )}
      </div>

      {isEditing ? (
        <InputField
          label="Branch"
          value={formData.branch}
          onChange={(v) => handleChange("branch", v)}
        />
      ) : (
        <p className="text-sm text-gray-400 mb-6">{batch.branch}</p>
      )}

      {/* Content */}
      <div className="space-y-4 text-sm mt-6">
        {isEditing ? (
          <>
            <InputField
              label="End Year"
              value={formData.batchEndYear}
              onChange={(v) => handleChange("batchEndYear", v)}
            />

            <InfoBlock
              label="Institution"
              value={batch?.institution?.name ?? "—"}
            />

            <InfoBlock label="Number of Students" value={studentCount} />

            <InfoBlock label="Created At" value={formattedDate} />
          </>
        ) : (
          <>
            <InfoBlock
              label="Institution"
              value={batch?.institution?.name ?? "—"}
            />
            <InfoBlock label="End Year" value={batch.batchEndYear} />
            <InfoBlock label="Number of Students" value={studentCount} />
            <InfoBlock label="Created At" value={formattedDate} />
          </>
        )}
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
            >
              <Save size={16} />
              Save
            </button>

            <button
              onClick={() => setIsEditing(false)}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              <X size={16} />
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              <Pencil size={16} />
              Edit
            </button>

            <button
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center gap-2 text-white border border-white px-4 py-2 rounded"
            >
              <Trash size={16} />
              Delete
            </button>
          </>
        )}
      </div>
    </aside>
  );
};

export default BatchSidebar;
