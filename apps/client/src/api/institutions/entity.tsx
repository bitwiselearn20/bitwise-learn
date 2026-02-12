import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";

const getUrl = (id: string, entity: string, operation: string) => {
  let url = "";
  switch (entity) {
    case "institution":
      url = `/api/admin/institution/${id}/${operation}`;
      break;
    case "vendor":
      url = `/api/admin/vendor/${id}/${operation}`;
      break;
    case "student":
      url = `/api/admin/student/${id}/${operation}`;
      break;
    case "batch":
      url = `/api/admin/batch/${id}/${operation}`;
      break;
    case "teacher":
      url = `/api/admin/teacher/${id}/${operation}`;
      break;
    case "admin":
      url = `/api/admin/admins/${id}/${operation}`;
      break;
    case "courses":
      url = `/api/course/enrollments/${id}/${operation}`;
      break;
  }
  return url;
};
export const updateEntity = async (id: string, data: any, stateFn: any) => {
  const toastId = toast.loading("Saving Changes...");
  try {
    const updatedData = await axiosInstance.post(
      getUrl(id, data.entity, "update"),
      data,
    );
    toast.success("Saved Changes...", { id: toastId });
    if (stateFn) {
      stateFn(updatedData.data);
    }
  } catch (error) {
    toast.error("Unable to update", { id: toastId });
  }
};
export const deleteEntity = async (id: string, data: any, stateFn: any) => {
  // console.log("hello inside the function");
  const toastId = toast.loading("Deleting...");
  try {
    const deleteData = await axiosInstance.post(
      getUrl(id, data.entity, "delete"),
      data,
    );
    toast.success("Deleted Entity...", { id: toastId });
    stateFn(deleteData.data);
  } catch (error) {
    console.error("Delete failed:", error);
  }
};
