import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export type Doctor = {
    _id: string;
    name: string;
    specialties?: string[]; // array of specialty ids
    avatar?: string;
    title?: string;
};

export async function getDoctors(specialtyId?: string): Promise<Doctor[]> {
    try {
        // backend exposes /doctors and /doctors/specialty/:id
        const url = specialtyId ? `${BASE_URL}/doctors/specialty/${specialtyId}` : `${BASE_URL}/doctors`;
        const res = await axios.get(url);
        const data = res?.data;
        if (Array.isArray(data)) return data as Doctor[];
        if (data && Array.isArray(data.data)) return data.data as Doctor[];
        if (data && Array.isArray(data.doctors)) return data.doctors as Doctor[];
        // fallback: log unexpected shape
        console.warn('getDoctors: unexpected response shape', data);
        return [];
    } catch (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }
}

export async function getDoctorById(doctorId: string): Promise<Doctor | null> {
    try {
        const url = `${BASE_URL}/doctors/${doctorId}`;
        const res = await axios.get(url);
        const data = res?.data;
        if (!data) return null;
        // Possible shapes from backend:
        // 1) { _id, name, ... }
        // 2) { data: { _id, name, ... } }
        // 3) { data: { doctor: { _id, name, ... }, schedules: [...] } }
        // 4) { doctor: { _id, name, ... } }
        if (data && (data as any)._id) return data as Doctor;
        if (data && (data as any).doctor && (data as any).doctor._id) return (data as any).doctor as Doctor;
        if (data && (data as any).data) {
            const inner = (data as any).data;
            if (inner._id) return inner as Doctor;
            if (inner.doctor && inner.doctor._id) return inner.doctor as Doctor;
        }

        console.warn('getDoctorById: unexpected response shape', data);
        return null;
    } catch (error) {
        console.error('Error fetching doctor by id:', error);
        return null;
    }
}
