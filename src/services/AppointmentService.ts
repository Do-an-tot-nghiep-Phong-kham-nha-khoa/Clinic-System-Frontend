import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export interface AppointmentPayload {
    booker_id: string;
    healthProfile_id: string;
    specialty_id: string;
    appointmentDate: string; // ISO string
    timeSlot: string;
    reason: string;
}

export interface AppointmentByDoctorPayload {
    booker_id: string;
    healthProfile_id: string;
    doctor_id: string;
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

export async function createAppointmentBySpecialty(payload: AppointmentPayload): Promise<AppointmentResponse> {
    const url = `${BASE_URL}/appointments/by-specialty`;

    try {
        const res = await axios.post(url, payload);
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
    const url = `${BASE_URL}/appointments/by-doctor`;

    try {
        const res = await axios.post(url, payload);
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
    const url = `${BASE_URL}/appointments/doctor/${doctorId}`;

    try {
        const res = await axios.get(url);
        return res.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            console.error("Lỗi GET lịch hẹn theo doctor:", error.response.data);
            throw new Error(error.response.data.message || "Lỗi lấy lịch hẹn bác sĩ.");
        }
        throw new Error("Lỗi kết nối server");
    }
}