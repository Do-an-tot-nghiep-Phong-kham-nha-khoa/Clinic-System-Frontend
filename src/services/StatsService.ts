import api from "./Api";

export async function getAppointmentsLast7Days() {
    const res = await api.get("/stats/appointments/last7days");
    return res.data;
}

export async function getRevenueLast7Days() {
    const res = await api.get("/stats/revenue/last7days");
    return res.data;
}

export async function getAppointmentStatusStats() {
    const res = await api.get("/stats/appointments/status");
    return res.data;
}

export async function getTotalRevenue() {
    const res = await api.get("/stats/revenue/total");
    return res.data;
}

export async function getTotalAppointments() {
    const res = await api.get("/stats/appointments/total");
    return res.data;
}
