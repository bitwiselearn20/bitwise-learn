"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

type Props = {
  openForm: (value: boolean) => void;
  onSubmit?: (data: VendorFormData) => void;
};

type VendorFormData = {
  name: string;
  email: string;
  secondaryEmail?: string;
  tagline: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  websiteLink: string;
};

const TOTAL_STEPS = 2;

export default function VendorForm({ openForm, onSubmit }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<VendorFormData>({
    name: "",
    email: "",
    secondaryEmail: "",
    tagline: "",
    phoneNumber: "",
    secondaryPhoneNumber: "",
    websiteLink: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  const back = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-divBg p-6 shadow-2xl">
        {/* Close */}
        <button
          onClick={() => openForm(false)}
          className="absolute right-4 top-4 text-white/50 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-xs text-primaryBlue">
            Step {step} of {TOTAL_STEPS}
          </p>
          <h2 className="mt-1 text-lg font-semibold text-white">
            Create Vendor
          </h2>
        </div>

        {/* Progress */}
        <div className="mb-6 h-1 w-full rounded bg-white/10">
          <div
            className="h-1 rounded bg-primaryBlue transition-all"
            style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* STEP 1 — Identity */}
          {step === 1 && (
            <>
              <Input
                label="Vendor Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <Input
                label="Tagline"
                name="tagline"
                value={formData.tagline}
                onChange={handleChange}
              />
              <Input
                label="Website Link"
                name="websiteLink"
                value={formData.websiteLink}
                onChange={handleChange}
              />
            </>
          )}

          {/* STEP 2 — Contact */}
          {step === 2 && (
            <>
              <Input
                label="Primary Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Secondary Email"
                name="secondaryEmail"
                type="email"
                value={formData.secondaryEmail}
                onChange={handleChange}
              />
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <Input
                label="Secondary Phone"
                name="secondaryPhoneNumber"
                value={formData.secondaryPhoneNumber}
                onChange={handleChange}
              />
            </>
          )}


          {/* Actions */}
          <div className="flex justify-between pt-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={back}
                className="text-sm text-white/60 hover:text-white"
              >
                Back
              </button>
            ) : (
              <span />
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  next();
                }}
                className="rounded-md bg-primaryBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-primaryBlue/90"
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-md bg-primaryBlue px-4 py-2 text-sm font-semibold text-white transition hover:bg-primaryBlue/90"
              >
                Create Vendor
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- UI Primitives ---------- */

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] uppercase tracking-wide text-primaryBlue">
      {children}
    </label>
  );
}

function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        {...props}
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:ring-2 focus:ring-primaryBlue"
      />
    </div>
  );
}
