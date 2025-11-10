import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export type Specialty = {
    _id: string;
    name: string;
    description: string;
};

export async function getSpecialties(): Promise<Specialty[]> {
    const url = `${BASE_URL}/specialties`;
    const res = await axios.get(url, { withCredentials: true });
    return res?.data ?? [];
}

export async function getSpecialtyById(specialtyId: string): Promise<Specialty | null> {
    const url = `${BASE_URL}/specialties/${specialtyId}`;
    try {
    const res = await axios.get(url, { withCredentials: true });
    return res?.data ?? null;
    } catch (error) {
        console.error("Lỗi khi lấy chuyên khoa theo ID:", error);
        return null;
    }
}