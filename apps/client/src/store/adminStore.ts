import { create } from "zustand";
import { persist } from "zustand/middleware";

// admin Information setup
const useAdmin = create(
  persist((set) => ({}), {
    name: "admin-storage", // storage key
  }),
);
