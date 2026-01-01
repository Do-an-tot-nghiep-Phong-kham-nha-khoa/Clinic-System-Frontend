import api from "./Api";

export async function getDashboardStats() {
    const response = await axios.get(`${BASE_URL}/stats/admin/dashboard`);
    return response.data;
}
