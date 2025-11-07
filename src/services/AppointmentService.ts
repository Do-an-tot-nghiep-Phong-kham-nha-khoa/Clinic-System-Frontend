import axios from 'axios';
export type AppointmentPayload = {
    _id?: string;

    booker_id?: string;
    healthProfile_id?: string;

    doctor_id?: string;
    specialty_id?: string;

    // DB fields
    appointment_date?: string;
    time_slot?: string;

    // FE convenience alias
    appointmentDate?: string;
    timeSlot?: string;

    reason?: string;
    notes?: string;
    status?: string;
    createdAt?: string;
};
export type AppointmentMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';
const API = `${BASE_URL}/appointments`;
export async function getAppointments(params: any = {}): Promise<{ items: AppointmentPayload[]; meta: AppointmentMeta | null }> {
    const url = `${API}`;
    const res = await axios.get(url, { params, withCredentials: true });
    const items: AppointmentPayload[] = res?.data?.data ?? res?.data?.appointments ?? res?.data?.items ?? res?.data ?? [];
    const meta: AppointmentMeta | null = res?.data?.meta ?? null;
    return { items, meta };
}
export async function getAppointment(id: string): Promise<AppointmentPayload> {
    const url = `${API}/${id}`;
    const res = await axios.get(url, { withCredentials: true });
    return res?.data ?? null;
}
export async function updateAppointment(id: string, status: string): Promise<AppointmentPayload> {
    const url = `${API}/${id}`;
    const res = await axios.put(url, { status }, { withCredentials: true });
    return res?.data ?? null;
}
export async function getAppointmentsByDoctor(doctorId: string): Promise<AppointmentPayload[]> {
    const url = `${API}/doctor/${doctorId}`;
    const res = await axios.get(url, { withCredentials: true });
    return res?.data?.data ?? res?.data ?? [];
}
export async function getAppointmentsByBooker(patientId: string): Promise<AppointmentPayload[]> {
    const url = `${API}/booker/${patientId}`;
    const res = await axios.get(url, { withCredentials: true });
    return res?.data?.data ?? res?.data ?? [];
}
export async function assignDoctor(appointment_id: string, doctor_id: string) {
    const url = `${API}/${appointment_id}/assign-doctor`;
    // Backend expects a PUT to /appointments/:id/assign-doctor with { doctor_id }
    const res = await axios.put(url, { doctor_id }, { withCredentials: true });
    return res?.data ?? null;
}
export async function createAppointment(payload: any): Promise<AppointmentPayload> {
    const url = `${API}`;
    const res = await axios.post(url, payload, { withCredentials: true });
    return res?.data ?? null;
}