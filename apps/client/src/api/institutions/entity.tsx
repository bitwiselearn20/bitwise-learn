import axiosInstance from "@/lib/axios";

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
      url = `/api/admin/admins/${id}/${operation}`;
      break;
  }
  return url;
};
export const updateEntity = async (id: string, data: any, stateFn: any) => {
  try {
    const updatedData = await axiosInstance.post(
      getUrl(id, data.entity, "update"),
      data,
    );
    console.log(updatedData.data);
    if (stateFn) {
      stateFn(updatedData.data);
    }
  } catch (error) {
    console.log(error);
  }
};
export const deleteEntity = async (id: string, data: any, stateFn: any) => {
  try {
    const deleteData = await axiosInstance.post(
      getUrl(id, data.entity, "delete"),
      data,
    );
    console.log(deleteData.data);
    stateFn(deleteData.data);
  } catch (error) {
    console.log(error);
  }
};
