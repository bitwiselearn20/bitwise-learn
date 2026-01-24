import axiosInstance from "@/lib/axios";
type CreateVendor = {
  name: string;
  email: string;
  secondaryEmail?: string;
  tagline: string;
  phoneNumber: string;
  secondaryPhoneNumber?: string;
  websiteLink?: string;
};

export const createVendors = async (payload: CreateVendor) => {
  const requestBody = {
    name: payload.name,
    email: payload.email,
    secondaryEmail: payload.secondaryEmail,
    tagline: payload.tagline,
    phoneNumber: payload.phoneNumber,
    secondaryPhoneNumber: payload.secondaryPhoneNumber,
    websiteLink: payload.websiteLink,
  };

  const response = await axiosInstance.post(
    "/api/vendor/create-vendor",
    requestBody,
  );

  return response.data.data;
};
