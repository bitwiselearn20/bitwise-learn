// "use client"
// import React, { useEffect } from "react";
// import { useState } from "react";
// import toast from "react-hot-toast";
// import { getAssessmentById } from "@/api/assessments/get-assessment-by-id";
// import { createAssessmentSection } from "@/api/assessments/create-assessment-section";
// import { getAssessmentSections } from "@/api/assessments/get-all-sections";

// interface BuilderProps {
//   assessmentId: string;
// }

// type Assessment = {
//   name: string;
//   description: string;
//   instruction: string;
//   startTime: string;
//   endTime: string;
//   individualSectionTimeLimit: number;
//   status: "UPCOMING" | "LIVE" | "ENDED";
//   batchId: string;
// };

// type section = {
//   name: string;
//   marksPerQuestion: number;
//   assessmentType: "CODE" | "NO_CODE";
// }

// export interface CreateAssessmentSection {
//   name: string;
//   marksPerQuestion: number;
//   assessmentType: "CODE" | "NO_CODE";
// }

// // -------------------------------------------------------------------------
// // Add Section Pop-up
// // -------------------------------------------------------------------------

// interface AddSectionModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (data: {
//     name: string;
//     marksPerQuestion: number;
//     assessmentType: "CODE" | "NO_CODE";
//   }) => void;
//   assessmentId: string;
// }

// const AddSectionModal = ({
//   open,
//   onClose,
//   onSubmit,
//   assessmentId,
// }: AddSectionModalProps) => {
//   const [form, setForm] = useState({
//     name: "",
//     marksPerQuestion: 1,
//     assessmentType: "NO_CODE" as "CODE" | "NO_CODE",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   if (!open) return null;

//   const clearError = (field: string) => {
//     if (errors[field]) {
//       setErrors((prev) => {
//         const copy = { ...prev };
//         delete copy[field];
//         return copy;
//       });
//     }
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;

//     setForm((prev) => ({
//       ...prev,
//       [name]:
//         name === "marksPerQuestion" ? Number(value) : value,
//     }));

//     clearError(name);
//   };

//   const handleSubmit = () => {
//     const newErrors: Record<string, string> = {};

//     if (!form.name.trim())
//       newErrors.name = "Section name is required";

//     if (!form.marksPerQuestion || form.marksPerQuestion < 1)
//       newErrors.marksPerQuestion =
//         "Marks per question must be at least 1";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     onSubmit(form);

//     setForm({
//       name: "",
//       marksPerQuestion: 1,
//       assessmentType: "NO_CODE",
//     });

//     onClose();
//   };

//   const inputBase =
//     "mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none transition";

//   const inputBorder = (field: string) =>
//     errors[field]
//       ? "border border-red-500 focus:border-red-500"
//       : "border border-slate-700 focus:border-sky-500";

//   const errorText = (field: string) =>
//     errors[field] ? (
//       <p className="mt-1 text-xs text-red-400">{errors[field]}</p>
//     ) : null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
//       <div
//         className="
//           w-full max-w-sm
//           rounded-2xl bg-slate-900
//           border border-slate-800
//           p-6
//         "
//       >
//         <h2 className="text-lg font-semibold text-white">
//           Create new section
//         </h2>

//         <div className="mt-4">
//           <label className="text-sm text-slate-400">
//             Section name
//           </label>
//           <input
//             name="name"
//             value={form.name}
//             onChange={handleChange}
//             placeholder="e.g. Basics"
//             className={`${inputBase} ${inputBorder("name")}`}
//             autoFocus
//           />
//           {errorText("name")}
//         </div>

//         <div className="mt-4">
//           <label className="text-sm text-slate-400">
//             Marks per question
//           </label>
//           <input
//             type="number"
//             name="marksPerQuestion"
//             min={1}
//             value={form.marksPerQuestion}
//             onChange={handleChange}
//             className={`${inputBase} ${inputBorder(
//               "marksPerQuestion"
//             )}`}
//           />
//           {errorText("marksPerQuestion")}
//         </div>

//         <div className="mt-4">
//           <label className="text-sm text-slate-400">
//             Assessment type
//           </label>
//           <select
//             name="assessmentType"
//             value={form.assessmentType}
//             onChange={handleChange}
//             className={`${inputBase} ${inputBorder(
//               "assessmentType"
//             )}`}
//           >
//             <option value="NO_CODE">MCQ</option>
//             <option value="CODE">Code</option>
//           </select>
//         </div>

//         <div className="mt-6 flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={handleSubmit}
//             className="px-4 py-2 rounded-lg bg-sky-600 text-black font-medium hover:bg-sky-500 transition"
//           >
//             Create Section
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const AssessmentBuilderV1 = ({ assessmentId }: BuilderProps) => {
//   const [assessmentData, setAssessmentData] = useState<Assessment | null>(null);
//   const [openCreateSection, setOpenCreateSection] = useState(false);
//   const [sections, setSections] = useState<section[]>([]);


//   const fetchAssessment = async () => {
//     try {
//       const res = await getAssessmentById(assessmentId);
//       setAssessmentData(res.data);
//     } catch (error) {
//       toast.error("Unable to fetch assessment");
//     }
//   };

//   useEffect(() => {
//     fetchAssessment();
//   }, [assessmentId]);



//   const fetchSections = async () => {
//     try {
//       const data = await getAssessmentSections(assessmentId);
//       console.log("Fetched sections data:", data);
//       setSections(Array.isArray(data) ? data : []);
//     } catch (error: any) {
//       console.error("Error fetching sections:", error);
//       toast.error("Unable to fetch sections");
//       setSections([]); 
//     }
//   };
  
  

//   useEffect(() => {
//     if (!assessmentId) return;
//     fetchSections();
//   }, [assessmentId]);
  
//   return (
//     <div className="w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between px-1 py-4">
//         <h1 className="text-xl font-semibold text-white">
//           {assessmentData?.name || "Untitled Assessment"}
//         </h1>

//         <button className="rounded-md bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-black hover:opacity-90 transition">
//           Publish
//         </button>
//       </div>

//       <div className="h-px w-full bg-linear-to-r bg-[#1DA1F2]/60 mb-10" />

//       {sections.length === 0 ? (
//         <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#121313] py-16 text-center">
//           <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1DA1F2]/15">
//             <span className="text-xl text-[#1DA1F2]">＋</span>
//           </div>

//           <h2 className="text-lg font-semibold text-white">
//             Create your first section
//           </h2>

//           <p className="mt-2 max-w-md text-sm text-white/60">
//             Sections help you organize questions, control time limits, and
//             structure your assessment better.
//           </p>

//           <button
//             onClick={() => setOpenCreateSection(true)}
//             className="mt-6 rounded-md bg-[#1DA1F2] px-6 py-2 text-sm font-medium text-black hover:opacity-90 transition"
//           >
//             + Add Section
//           </button>
//         </div>
//       ) : (
//         <div className="text-white/70">
//           <p className="italic">Sections will appear here…</p>
//           <button
//             onClick={() => setOpenCreateSection(true)}
//             className="mt-6 rounded-md bg-[#1DA1F2] px-6 py-2 text-sm font-medium text-black hover:opacity-90 transition"
//           >
//             + Add Section
//           </button>
//         </div>
//       )}

//       <AddSectionModal
//         open={openCreateSection}
//         onClose={() => setOpenCreateSection(false)}
//         onSubmit={async (data) => {
//           try {
//             toast.loading("Creating section...", { id: "create-section" });

//             await createAssessmentSection({
//               name: data.name,
//               marksPerQuestion: data.marksPerQuestion,
//               assessmentType: data.assessmentType,
//               assessmentId: assessmentId,
//             });

//             toast.success("Section created", { id: "create-section" });
//             fetchSections();
//           } catch (error: any) {
//             console.log("Creation error: ", error);
//             toast.error("Unable to create Section");
//           }
//         }}
//         assessmentId={assessmentId}
//       />
//     </div>
//   );
// };

// export default AssessmentBuilderV1;

"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAssessmentById } from "@/api/assessments/get-assessment-by-id";
import { createAssessmentSection } from "@/api/assessments/create-assessment-section";
import { getAssessmentSections } from "@/api/assessments/get-all-sections";

interface BuilderProps {
  assessmentId: string;
}

type Assessment = {
  name: string;
  description: string;
  instruction: string;
  startTime: string;
  endTime: string;
  individualSectionTimeLimit: number;
  status: "UPCOMING" | "LIVE" | "ENDED";
  batchId: string;
};

type Section = {
  id?: string;
  name: string;
  marksPerQuestion: number;
  assessmentType: "CODE" | "NO_CODE";
};

// -------------------------------------------------------------------------
// Add Section Modal
// -------------------------------------------------------------------------

interface AddSectionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    marksPerQuestion: number;
    assessmentType: "CODE" | "NO_CODE";
  }) => void;
  assessmentId: string;
}

const AddSectionModal = ({
  open,
  onClose,
  onSubmit,
}: AddSectionModalProps) => {
  const [form, setForm] = useState({
    name: "",
    marksPerQuestion: 1,
    assessmentType: "NO_CODE" as "CODE" | "NO_CODE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Section name is required";
    if (form.marksPerQuestion < 1)
      newErrors.marksPerQuestion = "Marks must be ≥ 1";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    onSubmit(form);
    setForm({ name: "", marksPerQuestion: 1, assessmentType: "NO_CODE" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6">
        <h2 className="text-lg font-semibold text-white">
          Create new section
        </h2>

        <div className="mt-4">
          <label className="text-sm text-slate-400">Section name</label>
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white border border-slate-700 focus:border-sky-500 outline-none"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name}</p>
          )}
        </div>

        <div className="mt-4">
          <label className="text-sm text-slate-400">
            Marks per question
          </label>
          <input
            type="number"
            min={1}
            value={form.marksPerQuestion}
            onChange={(e) =>
              setForm({
                ...form,
                marksPerQuestion: Number(e.target.value),
              })
            }
            className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white border border-slate-700 focus:border-sky-500 outline-none"
          />
        </div>

        <div className="mt-4">
          <label className="text-sm text-slate-400">Assessment type</label>
          <select
            value={form.assessmentType}
            onChange={(e) =>
              setForm({
                ...form,
                assessmentType: e.target.value as "CODE" | "NO_CODE",
              })
            }
            className="mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white border border-slate-700 focus:border-sky-500 outline-none"
          >
            <option value="NO_CODE">MCQ</option>
            <option value="CODE">Code</option>
          </select>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-sky-600 text-black font-medium hover:bg-sky-500"
          >
            Create Section
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// Main Builder
// -------------------------------------------------------------------------

const AssessmentBuilderV1 = ({ assessmentId }: BuilderProps) => {
  const [assessmentData, setAssessmentData] =
    useState<Assessment | null>(null);
  const [openCreateSection, setOpenCreateSection] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);

  const fetchAssessment = async () => {
    const res = await getAssessmentById(assessmentId);
    setAssessmentData(res.data);
  };

  const fetchSections = async () => {
    const data = await getAssessmentSections(assessmentId);
    setSections(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchAssessment();
    fetchSections();
  }, [assessmentId]);

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-1 py-4">
        <h1 className="text-xl font-semibold text-white">
          {assessmentData?.name || "Untitled Assessment"}
        </h1>
        <button className="rounded-md bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-black">
          Publish
        </button>
      </div>

      <div className="h-px w-full bg-[#1DA1F2]/60 mb-8" />

      {/* Sections */}
      {sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/10 bg-[#121313] py-16 text-center">
          <h2 className="text-lg font-semibold text-white">
            Create your first section
          </h2>
          <p className="mt-2 text-sm text-white/60">
            Sections help structure your assessment.
          </p>
          <button
            onClick={() => setOpenCreateSection(true)}
            className="mt-6 rounded-md bg-[#1DA1F2] px-6 py-2 text-sm font-medium text-black"
          >
            + Add Section
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div
              key={section.id ?? i}
              className="rounded-xl border border-white/10 bg-[#121313] p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {section.name}
                  </h3>
                  <p className="text-sm text-white/60">
                    {section.assessmentType === "NO_CODE"
                      ? "MCQ"
                      : "Code"}{" "}
                    • {section.marksPerQuestion} marks/question
                  </p>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button className="rounded-md bg-[#1DA1F2] px-4 py-2 text-sm font-medium text-black">
                  + Add Question
                </button>
                <button className="rounded-md bg-slate-800 px-4 py-2 text-sm text-white">
                  Edit
                </button>
                <button className="rounded-md bg-red-500/15 px-4 py-2 text-sm text-red-400">
                  Delete
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setOpenCreateSection(true)}
            className="mt-2 rounded-md border border-dashed border-white/20 px-6 py-3 text-sm text-white/70 hover:border-[#1DA1F2]"
          >
            + Add another section
          </button>
        </div>
      )}

      <AddSectionModal
        open={openCreateSection}
        onClose={() => setOpenCreateSection(false)}
        assessmentId={assessmentId}
        onSubmit={async (data) => {
          await createAssessmentSection({
            ...data,
            assessmentId,
          });
          toast.success("Section created");
          fetchSections();
        }}
      />
    </div>
  );
};

export default AssessmentBuilderV1;
