import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export interface AppointmentPayload {
    booker_id: string;
    healthProfile_id: string;
    doctor_id?: string;
    specialty_id: string;
    appointmentDate: string;
    timeSlot: string;
    reason: string;
}

export interface AppointmentResponse {
    _id: string;
    // ... các trường khác của lịch hẹn đã tạo
}

export async function createAppointment(payload: AppointmentPayload): Promise<AppointmentResponse> {
    const url = `${BASE_URL}/appointments`;

    try {
        const res = await axios.post(url, payload);
        return res.data;
    } catch (error) {
        // Log lỗi chi tiết hơn
        if (axios.isAxiosError(error) && error.response) {
            console.error("Lỗi API tạo lịch hẹn:", error.response.data);
            throw new Error(error.response.data.message || "Đã xảy ra lỗi khi tạo lịch hẹn.");
        }
        throw new Error("Lỗi kết nối hoặc xử lý không xác định.");
    }
}