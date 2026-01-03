import axiosInstance from "@/lib/axios";
// POST
export const deleteTestCase = async (id: string) => {
  const result = await axiosInstance.post("/api/admin/delete-testcase/" + id);
  return result;
};
