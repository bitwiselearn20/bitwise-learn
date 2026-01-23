import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Student {
  email: string;
  name: string;
  rollNumber: string;
  batch: {
    batchname: string;
    branch: string;
    batchEndYear: string;
  };
  insitution: {
    name: string;
    tagline: string;
    websiteLink: string;
  };
}

interface StudentStore {
  studentInfo: Student | null;
  setData: (data: Student) => void;
  logout: () => void;
}

export const useStudent = create<StudentStore>()(
  persist(
    (set) => ({
      studentInfo: null,
      setData: (data) => set({ studentInfo: data }),
      logout: () => set({ studentInfo: null }),
    }),
    {
      name: "student-storage",
      partialize: (state) => ({
        studentInfo: state.studentInfo, // persist ONLY data
      }),
    },
  ),
);
