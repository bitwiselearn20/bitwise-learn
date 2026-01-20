"use client";

import { deleteCourseById } from "@/api/courses/course/delete-course-by-id";
import { getCourseById } from "@/api/courses/course/get-course-by-id";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import AddSection from "../../add-section/v2/AddSectionV2";
import { uploadThumbnail } from "@/api/courses/course/upload-thumbnail";
import { uploadCertificate } from "@/api/courses/course/upload-certificate";
import { FileText, FileImage } from "lucide-react";
import PublishCourse from "../../publish-course/PublishCourse";
import { publishCourse } from "@/api/courses/course/publish-course";
import { createSection } from "@/api/courses/section/create-section";
import { getSections } from "@/api/courses/section/get-section";
import AddAssignment from "../../add-assignment/AddAssignment";

type Props = {
  courseId: string;
};

/* ---------------- Delete Confirmation Modal ---------------- */

const ConfirmDeleteModal = ({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-sm
          rounded-2xl
          bg-slate-900
          border border-slate-800
          p-6
          shadow-xl
          animate-in
          fade-in
          zoom-in-95
        "
      >
        <h2 className="text-lg font-semibold text-white">
          Delete this course?
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          This action is permanent and cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Create Section Modal ---------------- */

type CreateSectionModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (sectionName: string) => void;
};

const CreateSectionModal = ({
  open,
  onClose,
  onSubmit,
}: CreateSectionModalProps) => {
  const [sectionName, setSectionName] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6">
        {/* Header */}
        <h2 className="text-lg font-semibold text-white">Create new section</h2>

        {/* Input */}
        <div className="mt-4">
          <label className="text-sm text-slate-400">Section name</label>
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="e.g. Introduction"
            className="
              mt-2 w-full rounded-lg
              bg-slate-800 border border-slate-700
              px-3 py-2 text-sm text-white
              placeholder:text-slate-500
              focus:outline-none focus:border-sky-500
            "
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => {
              setSectionName("");
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              if (!sectionName.trim()) return;
              onSubmit(sectionName.trim());
              setSectionName("");
            }}
            className="px-4 py-2 rounded-lg bg-sky-600 text-black font-medium hover:bg-sky-500 transition"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

/* ADD ASSIGNMENT MODAL */

const AddAssignmentModal = ({
  open,
  onClose,
  sectionId,
  children,
}: {
  open: boolean;
  onClose: () => void;
  sectionId: string;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          w-full max-w-2xl
          rounded-2xl
          bg-slate-900
          border border-slate-800
          p-6
          shadow-xl
          animate-in
          fade-in
          zoom-in-95
        "
      >
        {children}
      </div>
    </div>
  );
};

/* ---------------- Main Component ---------------- */

const CourseBuilderV1 = ({ courseId }: Props) => {
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showCreateSection, setShowCreateSection] = useState(false);
  const [sections, setSections] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const certificateInputRef = useRef<HTMLInputElement | null>(null);
  const [certificateFileName, setCertificateFileName] = useState<string | null>(
    null,
  );
  const [thumbnailFileName, setThumbnailFileName] = useState<string | null>(
    null,
  );
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourse = async () => {
      const res = await getCourseById(courseId);
      console.log("COURSE RESPONSE : ", res);
      setCourse(res.data);
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    if (!courseId) return;

    const fetchSections = async () => {
      const res = await getSections(courseId);
      console.log("SECTIONS: ", res);
      setSections(res.data);
    };

    fetchSections();
  }, [courseId]);

  const CourseBuilderSkeleton = () => {
    return (
      <div className="p-4 pt-0 animate-pulse">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="h-7 w-64 bg-slate-800 rounded" />

          <div className="flex gap-3 mt-4">
            <div className="h-9 w-36 bg-slate-800 rounded-md" />
            <div className="h-9 w-36 bg-slate-800 rounded-md" />
            <div className="h-9 w-24 bg-slate-800 rounded-md" />
          </div>
        </div>

        {/* Section */}
        <div className="mt-10 space-y-8">
          <div className="rounded-xl border border-slate-800 p-5 space-y-4">
            <div className="h-5 w-40 bg-slate-800 rounded" />
            <div className="h-4 w-full bg-slate-800 rounded" />
            <div className="h-4 w-5/6 bg-slate-800 rounded" />
          </div>
        </div>

        {/* Add buttons */}
        <div className="flex gap-3 mt-6">
          <div className="h-9 w-32 bg-slate-800 rounded-md" />
          <div className="h-9 w-40 bg-slate-800 rounded-md" />
        </div>

        {/* Floating delete button */}
        <div className="fixed bottom-6 right-6 h-12 w-28 bg-slate-800 rounded-full" />
      </div>
    );
  };

  if (!course) {
    return <CourseBuilderSkeleton />;
  }

  const courseName = course.name;
  const instructorName = course.instructorName;
  // const sections = course.courseSections || [];

  const handleThumbnailUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      toast.loading("Uploading Thumbnail... ", { id: "thumbnail" });

      const res = await uploadThumbnail(courseId, file);

      if (res?.data?.thumbnail) {
        toast.success("ThumbNail Uploaded", { id: "thumbnail" });

        const refreshed = await getCourseById(courseId);
        setCourse(refreshed.data);
      } else {
        toast.error("Upload Failed", { id: "thumbnail" });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { id: "thumbnail" });
    } finally {
      setThumbnailFileName(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCertificateUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      toast.loading("Uploading Certificate...", { id: "certificate" });

      const res = await uploadCertificate(courseId, file);

      if (!res?.data?.certificate) throw new Error();

      toast.success("Certificate uploaded", { id: "certificate" });
      const refreshed = await getCourseById(courseId);
      setCourse(refreshed.data);
    } catch {
      toast.error("Certificate upload failed", { id: "certificate" });
    } finally {
      setCertificateFileName(null);
      if (certificateInputRef.current) certificateInputRef.current.value = "";
    }
  };

  const handlePublishCourse = async () => {
    try {
      toast.loading("Publishing Course...", { id: "publish" });

      const res = await publishCourse(courseId);

      if (!res.data) {
        throw new Error("Publish Failed");
      }

      toast.success("Course Published SuccessFully", { id: "publish" });

      const refreshed = await getCourseById(courseId);
      setCourse(refreshed.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to publish Course", { id: "publish" });
    } finally {
      setShowPublishModal(false);
    }
  };

  const publishRequirements = [
    {
      label: "Course name added",
      satisfied: Boolean(course?.name?.trim()),
    },
    {
      label: "Instructor name added",
      satisfied: Boolean(course?.instructorName?.trim()),
    },
    {
      label: "At least one section Needed",
      satisfied:
        Array.isArray(course?.courseSections) &&
        course.courseSections.length > 0,
    },
    {
      label: "Thumbnail uploaded",
      satisfied: Boolean(course?.thumbnail),
    },
    {
      label: "Certificate uploaded",
      satisfied: Boolean(course?.certificate),
    },
  ];

  return (
    <div className="p-4 pt-0">
      {/*HIDDEN FILE INPUT */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setThumbnailFileName(file.name);
          handleThumbnailUpload(e);
        }}
      />
      {/*HIDDEN INPUT FOR CERTIFICATE */}
      <input
        ref={certificateInputRef}
        type="file"
        accept="application/pdf,image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setCertificateFileName(file.name);
          handleCertificateUpload(e);
        }}
      />
      {/* top nav */}
      <div className="sticky top-0 z-40 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <h1 className="text-white text-2xl">
          {courseName} by {instructorName}
        </h1>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => certificateInputRef.current?.click()}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-700 text-sky-300 hover:border-sky-500 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileText size={16} />
              Upload Certificate
            </div>
            {certificateFileName && (
              <p className="mt-1 text-xs text-slate-400 truncate max-w-45">
                {certificateFileName}
              </p>
            )}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm rounded-md border border-slate-700 text-sky-300 hover:border-sky-500 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FileImage size={16} />
              Upload Thumbnail
            </div>
            {thumbnailFileName && (
              <p className="mt-1 text-xs text-slate-400 truncate max-w-45">
                {thumbnailFileName}
              </p>
            )}
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            className="px-4 py-1.5 text-sm rounded-md bg-sky-600 text-black font-medium hover:bg-sky-500 transition cursor-pointer"
          >
            Publish
          </button>
        </div>
      </div>

      {/* course sections */}
      <div className="mt-10 space-y-6">
        {sections.map((section, index) => (
          <AddSection
            key={section.id}
            sectionId={section.id}
            sectionNumber={index + 1}
            sectionData={section}
          />
        ))}
      </div>

      {/* add buttons */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={() => setShowCreateSection(true)}
          className="px-3 py-1.5 text-sm rounded-md bg-slate-800 text-sky-300 hover:bg-slate-700 transition"
        >
          + Add Section
        </button>

        <button
          onClick={() => {
            if (!sections.length) {
              toast.error("Create a Section First !");
              return;
            }
            setActiveSectionId(sections[0].id);
            setShowAddAssignment(true);
          }}
          className="px-3 py-1.5 text-sm rounded-md bg-slate-800 text-sky-300 hover:bg-slate-700 transition"
        >
          + Add Assignment
        </button>
      </div>

      {/* Floating Delete Button */}
      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="
          fixed bottom-6 right-6
          flex items-center gap-2
          px-4 py-3
          rounded-full
          bg-red-500/15
          backdrop-blur-md
          border border-red-500/30
          text-red-300
          shadow-lg
          hover:border-red-400/60
          hover:shadow-[0_0_18px_rgba(239,68,68,0.25)]
          hover:scale-102 transition cursor-pointer"
      >
        <Trash2 size={18} />
        Delete
      </button>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={async () => {
          try {
            await deleteCourseById(courseId);
            router.push("/admin-dashboard/courses");
            toast.success("Course deleted successfully");
          } catch (error) {
            toast.error("Failed to delete course");
          } finally {
            setShowDeleteConfirm(false);
          }
        }}
      />

      {/* publish course modal  */}
      <PublishCourse
        open={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onConfirm={handlePublishCourse}
        requirements={publishRequirements}
      />

      {/* create section modal  */}
      <CreateSectionModal
        open={showCreateSection}
        onClose={() => setShowCreateSection(false)}
        onSubmit={async (name) => {
          try {
            await createSection(courseId, name);
            toast.success("Section created!");

            const res = await getSections(courseId);
            setSections(res.data);
          } catch (error) {
            console.log(error);
            toast.error("Unable to create section");
          } finally {
            setShowCreateSection(false);
          }
        }}
      />

      {/*Add Assignment Modal */}
      {showAddAssignment && activeSectionId && (
        <AddAssignmentModal
          open={showAddAssignment && !!activeSectionId}
          sectionId={activeSectionId!}
          onClose={() => {
            setShowAddAssignment(false);
            setActiveSectionId(null);
          }}
        >
          <AddAssignment
            sectionId={activeSectionId!}
            onClose={async () => {
              setShowAddAssignment(false);
              setActiveSectionId(null);
              const res = await getSections(courseId);
              setSections(res.data);
            }}
          />
        </AddAssignmentModal>
      )}
    </div>
  );
};

export default CourseBuilderV1;
