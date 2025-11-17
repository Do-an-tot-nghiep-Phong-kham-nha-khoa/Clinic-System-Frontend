import axios from "axios";

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export async function getAppointmentsLast7Days() {
    const url = `${BASE_URL}/stats/appointments/last7days`;
    const res = await axios.get(url);
    return res.data;
}

export async function getRevenueLast7Days() {
    const url = `${BASE_URL}/stats/revenue/last7days`;
    const res = await axios.get(url);
    return res.data;
}

export async function getAppointmentStatusStats() {
    const url = `${BASE_URL}/stats/appointments/status`;
    const res = await axios.get(url);
    return res.data;
}

export async function getTotalRevenue() {
    const url = `${BASE_URL}/stats/revenue/total`;
    const res = await axios.get(url);
    return res.data;
}