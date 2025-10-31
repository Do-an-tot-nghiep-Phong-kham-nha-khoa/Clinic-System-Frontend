// src/service/authService.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const registerUser = async (data: {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dob: string;
  gender?: string;
  address?: string;
}) => {
  const response = await axios.post(`${BASE_URL}/accounts/register`, data, {
    withCredentials: true, // để nhận cookie từ backend
  });
  return response.data;
};
