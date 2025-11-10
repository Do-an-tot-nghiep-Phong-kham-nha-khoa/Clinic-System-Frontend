import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export type DoctorScheduleItem = {
  _id?: string;
  day: string;
  timeSlots: string[];
};
export type Specialty = {
  _id: string;
  name: string;
};
export interface Account {
  _id: string;
  email: string;
}
export type SpecialtyRef = {
  _id: string;
  name: string;
};

export type Doctor = {
  _id: string;
  name: string;
  specialtyId?: SpecialtyRef | null;
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
  avatar?: string;
  title?: string;
};
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

export async function getDoctorsWithPaging(params: { page?: number; limit?: number; q?: string; specialty?: string; specialtyId?: string; name?: string } = {}): Promise<{ items: Doctor[]; total: number; page: number; limit: number }> {
  const url = `${BASE_URL}/doctors`;
  // Map frontend params to backend query names: 'q' -> 'name', 'specialty'|'specialtyId' -> 'specialtyId'
  const sendParams: any = {};
  if (params.page) sendParams.page = params.page;
  if (params.limit) sendParams.limit = params.limit;
  if (params.q) sendParams.name = params.q;
  if (params.name) sendParams.name = params.name;
  if (params.specialtyId) sendParams.specialtyId = params.specialtyId;
  else if (params.specialty) sendParams.specialtyId = params.specialty;

  const res = await axios.get(url, { params: sendParams, withCredentials: true });
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
export async function getDoctorsByIds(ids: string[]): Promise<Doctor[]> {
  if (!ids || !ids.length) return [];
  const url = `${BASE_URL}/doctors/batch`;
  try {
    const res = await axios.post(url, { ids }, { withCredentials: true });
    return res?.data?.data ?? res?.data ?? [];
  } catch (e) {
    console.error('Error fetching doctors by ids', e);
    return [];
  }
}
export async function getDoctorById(id: string): Promise<Doctor | null> {
  const url = `${BASE_URL}/doctors/${id}`;
  try {
    const res = await axios.get(url, { withCredentials: true });
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
  const res = await axios.get(url, { params, withCredentials: true });
  return res?.data?.data ?? res?.data ?? [];
}

export async function getDoctorsBySpecialty(specialtyId: string, params: { page?: number; limit?: number } = {}): Promise<Doctor[]> {
  const url = `${BASE_URL}/doctors/specialty/${specialtyId}`;
  const res = await axios.get(url, { params });
  return res?.data?.data ?? res?.data ?? [];
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

export async function getDoctors(specialtyId?: string): Promise<Doctor[]> {
  try {
    const url = specialtyId
      ? `${BASE_URL}/doctors/specialty/${specialtyId}`
      : `${BASE_URL}/doctors`;
    const res = await axios.get(url);

    // backend trả về { message, data: [...] }
    const data = res?.data?.data;
    if (Array.isArray(data)) return data as Doctor[];

    console.warn('getDoctors: unexpected response shape', res.data);
    return [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export default {} as const;
