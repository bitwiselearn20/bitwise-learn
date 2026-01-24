"use client";

import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { createTeacher } from "@/api/teachers/create-teacher";
type TeacherFormData = {
  name: string;
  email: string;
  phoneNumber: string;
  instituteId: string;
  vendorId?: string;
  batchId: string;
};

type Props = {
  openForm: (value: boolean) => void;
  onSubmit?: (data: TeacherFormData) => void;
};

export default function TeacherForm({ openForm, onSubmit }: Props) {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: "",
    email: "",
    phoneNumber: "",
    instituteId: "",
    vendorId: "",
    batchId: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof TeacherFormData, string>>
  >({});

  const validators = useMemo(
    () => ({
      name: (value: string) => {
        if (!value.trim()) return "Name is required";
        if (!/^[A-Za-z\s]+$/.test(value))
          return "Only alphabets and spaces allowed";
        return "";
      },
      email: (value: string) => {
        if (!value.trim()) return "Email is required";
        if (!value.includes("@")) return "Email must contain @";
        return "";
      },
      phoneNumber: (value: string) => {
        if (!value.trim()) return "Phone number is required";
        if (!/^\d+$/.test(value)) return "Phone number must be digits only";
        return "";
      },
      instituteId: (value: string) => {
        if (!value.trim()) return "Institute ID is required";
        return "";
      },
      batchId: (value: string) => {
        if (!value.trim()) return "Batch ID is required";
        return "";
      },
      vendorId: () => "",
    }),
    [],
  );

  const validateField = (key: keyof TeacherFormData, value: string) => {
    const validator = validators[key];
    return validator ? validator(value) : "";
  };

  const validateAll = (data: TeacherFormData) => {
    const nextErrors: Partial<Record<keyof TeacherFormData, string>> = {};
    (Object.keys(validators) as Array<keyof TeacherFormData>).forEach((key) => {
      nextErrors[key] = validateField(key, (data[key] ?? "") as string);
    });
    return nextErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    const nextData = { ...formData, [name]: value } as TeacherFormData;
    setFormData(nextData);
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof TeacherFormData, value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors = validateAll(formData);
    setErrors(nextErrors);

    const hasError = Object.values(nextErrors).some(
      (msg) => msg && msg.length > 0,
    );
    if (hasError) return;

    try {
      onSubmit?.(formData);

      await createTeacher(formData);

      toast.success("Teacher created successfully");
    } catch (error) {
      console.error("Failed to create teacher", error);
      toast.error("Failed to create teacher");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-divBg p-6 shadow-2xl">
        <button
          onClick={() => openForm(false)}
          className="absolute right-4 top-4 text-white/50 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mt-1">
            Create Teacher
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Fill the details to create a teacher profile.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
            error={errors.name}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="teacher@example.com"
            required
            error={errors.email}
          />
          <Input
            label="Phone Number"
            name="phoneNumber"
            type="tel"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
            error={errors.phoneNumber}
          />
          <Input
            label="Institute ID"
            name="instituteId"
            value={formData.instituteId}
            onChange={handleChange}
            placeholder="e.g., INST-123"
            required
            error={errors.instituteId}
          />
          <Input
            label="Vendor ID"
            name="vendorId"
            value={formData.vendorId ?? ""}
            onChange={handleChange}
            placeholder="e.g., VNDR-123"
          />
          <Input
            label="Batch ID"
            name="batchId"
            value={formData.batchId}
            onChange={handleChange}
            placeholder="e.g., BATCH-001"
            required
            error={errors.batchId}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => openForm(false)}
              className="text-sm text-white/60 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-primaryBlue px-4 py-2 text-sm font-semibold text-white"
            >
              Create Teacher
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] uppercase tracking-wide text-primaryBlue">
      {children}
    </label>
  );
}

function Input({
  label,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...props}
        className={`mt-1 w-full rounded-lg border bg-black/30 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primaryBlue ${error ? "border-red-500 focus:ring-red-500" : "border-white/10"}`}
      />
      {error ? <p className="mt-1 text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
