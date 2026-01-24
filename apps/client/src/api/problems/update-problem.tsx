import axiosInstance from "@/lib/axios";

export const updateDescription = async (id: string, data: any) => {
  await axiosInstance.post("/api/admin/update-problem/" + id, {
    description: data.description,
    hints: data.hints || [],
    difficulty: data.difficulty,
  });

  await axiosInstance.post(
    "/api/admin/update-topic/" + data.problemTopics[0].id,
    {
      tagName: data.problemTopics[0].tagName,
    },
  );
};
