import axios from "axios";

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export async function getDashboardStats() {
    const response = await axios.get(`${BASE_URL}/stats/admin/dashboard`);
    return response.data;
}