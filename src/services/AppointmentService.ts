import axios from 'axios';

export type Appointment = {
    _id?: string;
    // flexible fields to match different backend shapes
    booker_id?: string;
    profile?: string;
    profileModel?: string;
    doctor_id?: string;
    specialty_id?: string;
    appointment_date?: string; // ISO date
    time_slot?: string;
    patientName?: string;
    doctorName?: string;
    appointmentDate?: string; // ISO date
    reason?: string;
    notes?: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
};

export type AppointmentMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type AppointmentQuery = {
    page?: number;
    limit?: number;
    sort?: string;
    q?: string;
};

export type CreateAppointmentDto = {
    patientName?: string;
    doctorName?: string;
    appointmentDate?: string;
    booker_id?: string;
    doctor_id?: string;
    appointment_date?: string;
    time_slot?: string;
    reason?: string;
    status?: string;
};

export type UpdateAppointmentDto = Partial<CreateAppointmentDto> & { status?: string };

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';
const API = `${BASE_URL}/appointments`;

export async function createAppointment(data: Appointment): Promise<Appointment> {
    const res = await axios.post(API, data);
    return res.data;
}
export async function getAppointments(): Promise<Appointment[]> {
    const res = await axios.get(API);
    return res.data;
}
export async function getAppointmentByDoctor(id: string): Promise<Appointment> {
    const res = await axios.get(`${API}/doctor/${id}`);
    return res.data;
}
export async function getAppointmentByBooker(id: string): Promise<Appointment> {
    const res = await axios.get(`${API}/booker/${id}`);
    return res.data;
}
export async function getAppointment(id: string): Promise<Appointment> {
    const res = await axios.get(`${API}/${id}`);
    return res.data;
}
export async function updateStatus(id: string, data: Partial<Appointment>): Promise<Appointment> {
    const res = await axios.patch(`${API}/${id}/status`, data);
    return res.data;
}

