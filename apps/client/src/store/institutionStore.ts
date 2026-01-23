import { create } from "zustand";
import { persist } from "zustand/middleware";

// institute Information setup
const useInstitution = create(
  persist((set) => ({}), {
    name: "institution-storage", // storage key
  }),
);
