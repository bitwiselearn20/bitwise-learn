import { create } from "zustand";
import { persist } from "zustand/middleware";

// vendor Information setup
const useVendor = create(
  persist((set) => ({}), {
    name: "vendor-storage", // storage key
  }),
);
