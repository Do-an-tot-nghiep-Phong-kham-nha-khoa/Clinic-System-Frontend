import api from './Api';
export type Specialty = {
    _id: string;
    name: string;
    description: string;
};

export async function getSpecialties(): Promise<Specialty[]> {
    const url = `/specialties`;
    const res = await api.get(url);
    return res?.data ?? [];
}

export async function getSpecialtyById(specialtyId: string): Promise<Specialty | null> {
    const url = `/specialties/${specialtyId}`;
    try {
        const res = await api.get(url);
        return res?.data ?? null;
    } catch (error) {
        console.error("Lỗi khi lấy chuyên khoa theo ID:", error);
        return null;
    }
}