import axiosInstance from "@/lib/axios";

export const getVendorDashboard = async (setVendor: any) => {
  try {
    const res = await axiosInstance.get("/api/vendor/dashboard");
    setVendor(res.data.data.vendor);
  } catch (err) {
    console.error("Failed to load vendor dashboard", err);
  }
};