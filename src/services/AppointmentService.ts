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