"use client";

// imports -----------------------------------------------------------------
import { useEffect, useState } from "react";
import { Search, ClipboardList, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { createAssessments } from "@/api/assessments/create-assessments";
import { getAllAssessments } from "@/api/assessments/get-all-assessments";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

// colors ------------------------------------------------------------------
const colors = {
  primary_Bg: "bg-[#121313]",
  secondary_Bg: "bg-[#1E1E1E]",
  special_Bg: "bg-[#64ACFF]",
  primary_Hero: "bg-[#129274]",
  primary_Font: "text-[#FFFFFF]",
  secondary_Font: "text-[#B1AAA6]",
  border: "border border-white/10",
};

// types -------------------------------------------------------------------
type CreateAssessment = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  startTime: string;
  endTime: string;
  individualSectionTimeLimit?: number;
  status?: "UPCOMING" | "LIVE" | "ENDED";
  batchId: string;
};

// -------------------------------------------------------------------------
// Assessment Card
// -------------------------------------------------------------------------
const AssessmentCard = ({ assessment }: { assessment: CreateAssessment }) => {
  const statusStyles =
    assessment.status === "LIVE"
      ? "bg-green-500/15 text-green-400 border-green-500/30"
      : assessment.status === "ENDED"
        ? "bg-red-500/15 text-red-400 border-red-500/30"
        : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30";

  const router = useRouter();

  const handleClick = (assessmentId: string) => {
    router.push(`/admin-dashboard/assessments/${assessmentId}`);
  };
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`
        rounded-xl p-4 flex flex-col gap-4
        ${colors.secondary_Bg}
        ${colors.border}
        hover:border-white/20 transition
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className={`text-lg font-semibold ${colors.primary_Font}`}>
          {assessment.name}
        </h3>

        {assessment.status && (
          <span
            className={`text-xs px-3 py-1 rounded-full border ${statusStyles}`}
          >
            {assessment.status}
          </span>
        )}
      </div>

      <p className={`text-sm leading-relaxed ${colors.secondary_Font}`}>
        {assessment.description}
      </p>

      <div className="flex items-center gap-2 text-xs text-secondary-font">
        <Clock size={14} />
        <span>
          {new Date(assessment.startTime).toLocaleString()} —{" "}
          {new Date(assessment.endTime).toLocaleString()}
        </span>
      </div>

      <p className="text-xs italic text-secondary-font line-clamp-2">
        {assessment.instructions}
      </p>

      <button
        className={`
          mt-auto w-full rounded-md py-2 text-sm font-medium
          ${colors.primary_Hero} text-white
          hover:opacity-90 transition
        `}
        onClick={() => handleClick(assessment.id)}
      >
        Edit Assessment
      </button>
    </motion.div>
  );
};

// -------------------------------------------------------------------------
// Add Assessment Pop-up
// -------------------------------------------------------------------------
interface AddAssessmentModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssessment) => void;
}
const AddAssessmentModal = ({
  open,
  onClose,
  onSubmit,
}: AddAssessmentModalProps) => {
  const [form, setForm] = useState<CreateAssessment>({
    id: "",
    name: "",
    description: "",
    instructions: "",
    startTime: "",
    endTime: "",
    individualSectionTimeLimit: undefined,
    batchId: "",
    status: "UPCOMING",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [startDate, setStartDate] = useState("");
  const [startClock, setStartClock] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endClock, setEndClock] = useState("");

  if (!open) return null;

  const combineDateTime = (d: string, t: string) => (d && t ? `${d}T${t}` : "");

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleSubmit = () => {
    const payload = {
      ...form,
      startTime: combineDateTime(startDate, startClock),
      endTime: combineDateTime(endDate, endClock),
    };

    const newErrors: Record<string, string> = {};

    if (!payload.name.trim()) newErrors.name = "Assessment name is required";
    if (!payload.description.trim())
      newErrors.description = "Description is required";
    if (!payload.instructions.trim())
      newErrors.instructions = "Instructions are required";
    if (!payload.startTime) newErrors.startTime = "Start date & time required";
    if (!payload.endTime) newErrors.endTime = "End date & time required";
    if (!payload.batchId.trim()) newErrors.batchId = "Batch ID is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(payload);
    onClose();
  };

  const inputBase =
    "mt-1 w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none transition";

  const inputBorder = (field: string) =>
    errors[field]
      ? "border border-red-500 focus:border-red-500"
      : "border border-slate-700 focus:border-sky-500";

  const errorText = (field: string) =>
    errors[field] ? (
      <p className="mt-1 text-xs text-red-400">{errors[field]}</p>
    ) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className="
          w-full max-w-lg
          max-h-[85vh] overflow-y-auto
          rounded-2xl bg-slate-900
          border border-slate-800
          p-5
        "
      >
        <h2 className="text-lg font-semibold text-white mb-3">
          Create new assessment
        </h2>

        {/* Name */}
        <div className="mt-3">
          <label className="text-sm text-slate-400">Assessment name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. JavaScript Fundamentals"
            className={`${inputBase} ${inputBorder("name")}`}
          />
          {errorText("name")}
        </div>

        {/* Description */}
        <div className="mt-3">
          <label className="text-sm text-slate-400">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={2}
            placeholder="Brief description of the assessment"
            className={`${inputBase} resize-none ${inputBorder("description")}`}
          />
          {errorText("description")}
        </div>

        {/* Instructions */}
        <div className="mt-3">
          <label className="text-sm text-slate-400">Instructions</label>
          <textarea
            name="instructions"
            value={form.instructions}
            onChange={handleChange}
            rows={2}
            placeholder="Instructions for students"
            className={`${inputBase} resize-none ${inputBorder("instructions")}`}
          />
          {errorText("instructions")}
        </div>

        {/* Start / End Time */}
        <div className="mt-4 space-y-3">
          {/* Start */}
          <div>
            <label className="text-sm text-slate-400">Start time</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <input
                type="date"
                className={`${inputBase} mt-0 col-span-2 ${inputBorder(
                  "startTime",
                )}`}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  clearError("startTime");
                }}
              />
              <input
                type="time"
                className={`${inputBase} mt-0 ${inputBorder("startTime")}`}
                value={startClock}
                onChange={(e) => {
                  setStartClock(e.target.value);
                  clearError("startTime");
                }}
              />
            </div>
            {errorText("startTime")}
          </div>

          {/* End */}
          <div>
            <label className="text-sm text-slate-400">End time</label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              <input
                type="date"
                className={`${inputBase} mt-0 col-span-2 ${inputBorder(
                  "endTime",
                )}`}
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  clearError("endTime");
                }}
              />
              <input
                type="time"
                className={`${inputBase} mt-0 ${inputBorder("endTime")}`}
                value={endClock}
                onChange={(e) => {
                  setEndClock(e.target.value);
                  clearError("endTime");
                }}
              />
            </div>
            {errorText("endTime")}
          </div>
        </div>

        {/* Batch ID */}
        <div className="mt-3">
          <label className="text-sm text-slate-400">Batch ID</label>
          <input
            name="batchId"
            value={form.batchId}
            onChange={handleChange}
            placeholder="e.g. batch-1"
            className={`${inputBase} ${inputBorder("batchId")}`}
          />
          {errorText("batchId")}
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3 sticky bottom-0 bg-slate-900 pt-3">
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
            Create Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------------
// Skeleton Card
// -------------------------------------------------------------------------
const AssessmentSkeleton = () => (
  <div
    className={`
      rounded-xl p-4 flex flex-col gap-4
      ${colors.secondary_Bg}
      ${colors.border}
      animate-pulse
    `}
  >
    <div className="flex justify-between gap-4">
      <div className="h-5 w-2/3 rounded bg-white/10" />
      <div className="h-5 w-16 rounded bg-white/10" />
    </div>

    <div className="h-4 w-full rounded bg-white/10" />
    <div className="h-4 w-5/6 rounded bg-white/10" />

    <div className="h-3 w-3/4 rounded bg-white/10" />

    <div className="h-8 w-full rounded bg-white/10 mt-auto" />
  </div>
);

// -------------------------------------------------------------------------
// Empty State
// -------------------------------------------------------------------------
interface NoAssessmentStateProps {
  onCreate: () => void;
}

const NoAssessmentState = ({ onCreate }: NoAssessmentStateProps) => (
  <section className="flex flex-col items-center justify-center gap-6 pt-24 text-center">
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-[#64ACFF]"
    >
      <ClipboardList size={40} className="text-white" />
    </motion.div>

    <p className={`text-xl font-semibold ${colors.primary_Font}`}>
      No assessments created yet
    </p>

    <p className={`max-w-md text-sm ${colors.secondary_Font}`}>
      Create assessments to evaluate learners, track progress, and measure
      understanding across topics.
    </p>

    <button
      className={`
        rounded-md px-6 py-2 font-medium
        ${colors.special_Bg} text-white
        hover:opacity-90 transition
      `}
      onClick={onCreate}
    >
      + Create your first assessment
    </button>
  </section>
);

// -------------------------------------------------------------------------
// Main Component
// -------------------------------------------------------------------------

const AssessmentsV1 = () => {
  const [assessments, setAssessments] = useState<CreateAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreateAssessment, setOpenCreateAssessment] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await getAllAssessments();
      setAssessments(res.data || []);
    } catch (error) {
      console.log("Fetching Error: ", error);
      toast.error("Failed to load Assessments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const assessmentData = fetchAssessments();
  }, []);

  const filteredAssessments = assessments.filter((assessment) => {
    if (!searchText.trim()) return true;

    const query = searchText.toLowerCase();

    return (
      assessment.name.toLowerCase().includes(query) ||
      assessment.description.toLowerCase().includes(query)
    );
  });

  return (
    <section className="flex w-full flex-col gap-6 p-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-96">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-font"
          />
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className={`
              w-full rounded-md pl-10 pr-4 py-2 text-sm
              ${colors.secondary_Bg} ${colors.primary_Font}
              outline-none border border-white/10
              focus:border-white/20 transition
            `}
          />
        </div>

        <button
          className={`
            rounded-md px-4 py-2 text-sm font-medium
            ${colors.special_Bg} text-white
            hover:opacity-90 transition
          `}
          onClick={() => {
            setOpenCreateAssessment(true);
          }}
        >
          + Add Assessment
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <AssessmentSkeleton key={i} />
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <NoAssessmentState onCreate={() => setOpenCreateAssessment(true)} />
      ) : filteredAssessments.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 pt-20 text-center">
          <Search size={40} className="text-[#64ACFF]" />
          <p className={`text-xl font-semibold ${colors.primary_Font}`}>
            No matching assessments found
          </p>
          <p className={`text-sm ${colors.secondary_Font}`}>
            Try adjusting your search keywords.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAssessments.map((assessment, index) => (
            <AssessmentCard key={index} assessment={assessment} />
          ))}
        </div>
      )}

      {/* Add Assessment pop-up Modal  */}
      <AddAssessmentModal
        open={openCreateAssessment}
        onClose={() => setOpenCreateAssessment(false)}
        onSubmit={async (data) => {
          console.log("Assessment payload:", data);
          const toastId = toast.loading("Creating assessment...");

          try {
            await createAssessments(data);
            toast.success("Assessment created successfully!", {
              id: toastId,
            });
            setOpenCreateAssessment(false);

            await fetchAssessments();
          } catch (error) {
            console.error("Create assessment error:", error);

            toast.error("Unable to create assessment", {
              id: toastId,
            });
          }
        }}
      />
    </section>
  );
};

export default AssessmentsV1;
