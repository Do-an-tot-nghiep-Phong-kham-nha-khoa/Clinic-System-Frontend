import axios from "axios";

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export interface Specialty {
    _id: string;
    name: string;
}

export interface Account {
    _id: string;
    email: string;
}

export interface DoctorProfile {
    _id: string;
    accountId: Account;
    name: string;
    specialtyId: Specialty;
    phone: string;
    experience: number; // Số năm kinh nghiệm
}

interface DoctorResponse {
    message: string;
    data: DoctorProfile;
}

export interface UpdateDoctorPayload {
    specialtyId?: string;
    name?: string;
    phone?: string;
    experience?: number;
}

export async function getDoctorByAccountId(accountId: string): Promise<DoctorProfile> {
    const url = `${BASE_URL}/doctors/account/${accountId}`;

    try {
        const res = await axios.get<DoctorResponse>(url);
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || `Lỗi khi gọi API: ${error.message}`;
            console.error(`Error fetching doctor profile for accountId ${accountId}:`, errorMessage);
            throw new Error(errorMessage);
        }
        throw new Error('Lỗi không xác định khi tải hồ sơ bác sĩ.');
    }
}

export async function updateDoctorById(
    doctorId: string,
    payload: UpdateDoctorPayload
): Promise<DoctorProfile> {
    const url = `${BASE_URL}/doctors/${doctorId}`;

    try {
        const res = await axios.put<DoctorResponse>(url, payload);
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const errorMessage = error.response?.data?.message || `Lỗi khi gọi API: ${error.message}`;
            throw new Error(errorMessage);
        }
        throw new Error('Lỗi không xác định khi cập nhật hồ sơ bác sĩ.');
    }
}