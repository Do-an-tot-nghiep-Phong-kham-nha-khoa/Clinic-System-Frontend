import axios from 'axios';
import api from './Api';
export type AppointmentPayload = {
    _id?: string;

    booker_id?: string;
    healthProfile_id?: string;

    doctor_id?: string;
    specialty_id?: string;
    appointment_date?: string;
    time_slot?: string;
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
export interface AppointmentByDoctorPayload {
    booker_id: string;
    healthProfile_id: string;
    doctor_id: string;
    appointmentDate: string; // ISO string
    timeSlot: string;
    reason: string;
}
export interface AppointmentBySpecialtyPayload {
    booker_id: string;
    healthProfile_id: string;
    specialty_id: string;
    appointmentDate: string; // ISO string
    timeSlot: string;
    reason: string;
}
export interface AppointmentResponse {
    _id: string;
    // ... các field khác trả về sau này
}

export interface HealthProfileOwner {
    _id: string;
    name: string;
    dob: string;
    gender: string;
    phone: string;
}

export interface HealthProfile {
    _id: string;
    height: number;
    weight: number;
    bloodType: string;
    allergies: string[];
    chronicConditions: string[];
    medications: string[];
    owner_detail: HealthProfileOwner;
}

export interface AppointmentModel {
    _id: string;
    booker_id: string;
    doctor_id: string;
    healthProfile_id: HealthProfile;
    specialty_id: string;
    appointmentDate: string;
    timeSlot: string;
    reason: string;
    status: string;
    createdAt: string;
}

export interface ListAppointmentByDoctorResponse {
    count: number;
    appointments: AppointmentModel[];
}

export interface DoctorDetail {
    _id: string;
    accountId: string;
    name: string;
    specialtyId: string;
    phone: string;
    experience: number;
}

export interface SpecialtyDetail {
    _id: string;
    name: string;
    description: string;
}

export interface BookerAppointmentModel {
    _id: string;
    doctor_id: DoctorDetail;
    specialty_id: SpecialtyDetail;
    booker_id: string;
    healthProfile_id: HealthProfile;
    appointmentDate: string;
    timeSlot: string;
    reason: string;
    status: string;
    createdAt: string;
}

export interface ListAppointmentByBookerResponse {
    count: number;
    appointments: BookerAppointmentModel[];
}

export async function getAppointments(params: any = {}): Promise<{ items: AppointmentPayload[]; meta: AppointmentMeta | null }> {
    const url = `/appointments`;
    const res = await api.get(url, { params, withCredentials: true });
    const items: AppointmentPayload[] = res?.data?.data ?? res?.data?.appointments ?? res?.data?.items ?? res?.data ?? [];
    const meta: AppointmentMeta | null = res?.data?.meta ?? null;
    return { items, meta };
}
export async function getAppointment(id: string): Promise<AppointmentPayload> {
    const url = `appointments/${id}`;
    const res = await api.get(url, { withCredentials: true });
    return res?.data ?? null;
}
export async function updateAppointment(id: string, status: string): Promise<AppointmentPayload> {
    const url = `appointments/${id}`;
    const res = await api.put(url, { status }, { withCredentials: true });
    return res?.data ?? null;
}
export async function assignDoctor(appointment_id: string, doctor_id: string) {
    const url = `appointments/${appointment_id}/assign-doctor`;
    // Backend expects a PUT to /appointments/:id/assign-doctor with { doctor_id }
    const res = await api.put(url, { doctor_id }, { withCredentials: true });
    return res?.data ?? null;
}
export async function createAppointment(payload: any): Promise<AppointmentPayload> {
    const url = `appointments`;
    const res = await api.post(url, payload, { withCredentials: true });
    return res?.data ?? null;
}
export async function createAppointmentBySpecialty(payload: AppointmentBySpecialtyPayload): Promise<AppointmentResponse> {
    const url = `/appointments/by-specialty`;

    try {
        const res = await api.post(url, payload);
        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Lỗi API tạo lịch hẹn:", error.response.data);
            throw new Error(error.response.data.message || "Đã xảy ra lỗi khi tạo lịch hẹn.");
        }
        throw new Error("Lỗi kết nối hoặc xử lý không xác định.");
    }
}

export async function createAppointmentByDoctor(payload: AppointmentByDoctorPayload): Promise<AppointmentResponse> {
    const url = `/appointments/by-doctor`;

    try {
        const res = await api.post(url, payload);
        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Lỗi API tạo lịch hẹn:", error.response.data);
            throw new Error(error.response.data.message || "Đã xảy ra lỗi khi tạo lịch hẹn.");
        }
        throw new Error("Lỗi kết nối hoặc xử lý không xác định.");
    }
}

export async function getAppointmentsByDoctor(doctorId: string): Promise<ListAppointmentByDoctorResponse> {
    const url = `/appointments/doctor/${doctorId}`;

    try {
        const res = await api.get(url);
        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Lỗi GET lịch hẹn theo doctor:", error.response.data);
            throw new Error(error.response.data.message || "Lỗi lấy lịch hẹn bác sĩ.");
        }
        throw new Error("Lỗi kết nối server");
    }
}

export async function getAppointmentsByBooker(bookerId: string): Promise<ListAppointmentByBookerResponse> {
    const url = `/appointments/booker/${bookerId}`;
    try {
        const res = await api.get(url);
        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Lỗi GET lịch hẹn theo booker:", error.response.data);
            throw new Error(error.response.data.message || "Lỗi lấy lịch hẹn người đặt.");
        }
        throw new Error("Lỗi kết nối server");
    }
}

export async function cancelAppointment(appointmentId: string): Promise<AppointmentPayload> {
    const url = `/appointments/${appointmentId}/cancel`;
    try {
        const res = await api.put(url);
        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Lỗi hủy lịch hẹn:", error.response.data);
            throw new Error(error.response.data.message || "Lỗi hủy lịch hẹn.");
        }
        throw new Error("Lỗi kết nối server");
    }
}

export async function getAppointmentsByDoctorToday(doctorId: string): Promise<ListAppointmentByDoctorResponse> {
    const url = `/appointments/doctor/${doctorId}/today`;
    try {
        const res = await api.get(url);
        return res.data;
    }
    catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Lỗi GET lịch hẹn hôm nay theo doctor:", error.response.data);
            throw new Error(error.response.data.message || "Lỗi lấy lịch hẹn bác sĩ hôm nay.");
        }
        throw new Error("Lỗi kết nối server");
    }
}