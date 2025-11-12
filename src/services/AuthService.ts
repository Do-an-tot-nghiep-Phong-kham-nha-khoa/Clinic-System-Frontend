// src/service/authService.ts
import api from "./Api";

export const registerUser = async (data: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dob: string;
  gender?: string;
  address?: string;
}) => {
  const respone = await api.post("/auth/register", data);
  return respone.data;
};
