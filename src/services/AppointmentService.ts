import axios from 'axios';
export type Appointment = {
    _id?: string;
    booker_id?: string;
    healthProfile_id?: string;
    doctor_id?: string;
    specialty_id?: string;
    appointment_date?: string; // ISO date
    time_slot?: string;
    appointmentDate?: string; // ISO date
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

export async function getAppointment(id: string): Promise<Appointment> {
    const url = `${API}/${id}`;
    const res = await axios.get(url);
    return res?.data ?? null;
}
export async function updateAppointment(id: string, status: string): Promise<Appointment> {
    const url = `${API}/${id}`;
    const res = await axios.put(url, { status });
    return res?.data ?? null;
}
export async function getAppointmentsByDoctor(doctorId: string): Promise<Appointment[]> {
    const url = `${API}/doctor/${doctorId}`;
    const res = await axios.get(url);
    return res?.data?.data ?? res?.data ?? [];
}
export async function getAppointmentsByBooker(patientId: string): Promise<Appointment[]> {
    const url = `${API}/booker/${patientId}`;
    const res = await axios.get(url);
    return res?.data?.data ?? res?.data ?? [];
}
export async function assignDoctor(doctor_id:string) {
    const url = `${API}/assign-doctor`;
    const res = await axios.post(url, { doctor_id });
    return res?.data ?? null;
}
