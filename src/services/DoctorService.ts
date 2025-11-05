import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export type DoctorScheduleItem = {
    _id?: string;
    day: string;
    timeSlots: string[];
};

export type SpecialtyRef = {
    _id: string;
    name: string;
};

export type Doctor = {
    _id: string;
    name: string;
    specialtyId?: string | SpecialtyRef | null;
    phone?: string;
    email?: string;
    password?: string;
    experience?: number;
    schedule?: DoctorScheduleItem[];
    photo?: string;
    clinic?: string;
    degrees?: string[];
    bio?: string;
    __v?: number;
};

export async function getDoctors(params: { page?: number; limit?: number; q?: string; specialty?: string; specialtyId?: string; name?: string } = {}): Promise<{ items: Doctor[]; total: number; page: number; limit: number }> {
    const url = `${BASE_URL}/doctors`;
    // Map frontend params to backend query names: 'q' -> 'name', 'specialty'|'specialtyId' -> 'specialtyId'
    const sendParams: any = {};
    if (params.page) sendParams.page = params.page;
    if (params.limit) sendParams.limit = params.limit;
    if (params.q) sendParams.name = params.q;
    if (params.name) sendParams.name = params.name;
    if (params.specialtyId) sendParams.specialtyId = params.specialtyId;
    else if (params.specialty) sendParams.specialtyId = params.specialty;

    const res = await axios.get(url, { params: sendParams });
    const body = res?.data ?? {};

    // Expected backend shape (based on your example): { message, data: [...], pagination: { page, pageSize, totalItems, totalPages } }
    if (Array.isArray(body.data) && body.pagination) {
        const items = body.data as Doctor[];
    const page = Number(body.pagination.page) || (params.page ?? 1);
    const limit = Number(body.pagination.pageSize) || (params.limit ?? 10);
        const total = Number(body.pagination.totalItems) || items.length;
        return { items, total, page, limit };
    }

    // Fallbacks for other shapes
    if (Array.isArray(body)) {
        const items = body as Doctor[];
        return { items, total: items.length, page: params.page ?? 1, limit: params.limit ?? items.length };
    }

    if (Array.isArray(body.items)) {
        const items = body.items as Doctor[];
        const total = typeof body.total === 'number' ? body.total : items.length;
        return { items, total, page: params.page ?? 1, limit: params.limit ?? items.length };
    }

    if (Array.isArray(body.data)) {
        const items = body.data as Doctor[];
        return { items, total: items.length, page: params.page ?? 1, limit: params.limit ?? items.length };
    }

    // last resort: try nested properties
    const items = (body?.data?.doctors ?? body?.doctors ?? []) as Doctor[];
    return { items, total: Array.isArray(items) ? items.length : 0, page: params.page ?? 1, limit: params.limit ?? (items.length || 10) };
}

export async function getDoctorById(id: string): Promise<Doctor | null> {
    const url = `${BASE_URL}/doctors/${id}`;
    try {
        const res = await axios.get(url);
            if (res?.data?.data) {
                // Some APIs return { data: { doctor: { ... }, schedules: [...] } }
                if (res.data.data.doctor) return res.data.data.doctor;
                return res.data.data;
            }
            return res?.data ?? null;
    } catch (e) {
        console.error('Error fetching doctor by id', e);
        return null;
    }
}

export async function createDoctor(dto: Partial<Doctor>): Promise<Doctor | null> {
    const url = `${BASE_URL}/doctors`;
    try {
        const res = await axios.post(url, dto);
        return res?.data?.data ?? res?.data ?? null;
    } catch (e) {
        console.error('Error creating doctor', e);
        throw e;
    }
}

export async function updateDoctor(id: string, dto: Partial<Doctor>): Promise<Doctor | null> {
    const url = `${BASE_URL}/doctors/${id}`;
    try {
        const res = await axios.put(url, dto);
        return res?.data?.data ?? res?.data ?? null;
    } catch (e) {
        console.error('Error updating doctor', e);
        throw e;
    }
}

export async function deleteDoctor(id: string): Promise<void> {
    const url = `${BASE_URL}/doctors/${id}`;
    await axios.delete(url);
}

// search doctors by query params (e.g., ?q=smith&page=1&limit=10)
export async function searchDoctors(params: { q?: string; page?: number; limit?: number } = {}): Promise<Doctor[]> {
    const url = `${BASE_URL}/doctors/search`;
    const res = await axios.get(url, { params });
    return res?.data?.data ?? res?.data ?? [];
}

export async function getDoctorsBySpecialty(specialtyId: string, params: { page?: number; limit?: number } = {}): Promise<Doctor[]> {
    const url = `${BASE_URL}/doctors/specialty/${specialtyId}`;
    const res = await axios.get(url, { params });
    return res?.data?.data ?? res?.data ?? [];
}

export default {} as const;
