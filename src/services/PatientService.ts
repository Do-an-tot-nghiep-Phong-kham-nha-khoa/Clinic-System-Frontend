import api from './Api';

export type Patient = {
    _id?: string;
    accountId?: string; // ObjectId reference to Account
    name: string;
    dob?: string; // ISO date
    phone: string;
    address?: string;
    gender?: 'male' | 'female' | 'other' | string;
    createdAt?: string;
    updatedAt?: string;
};

export type PatientMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type PatientQuery = {
    page?: number;
    limit?: number;
    sort?: string;
    q?: string;
};

export type CreatePatientDto = {
    accountId: string;
    name: string;
    dob?: string;
    phone: string;
    address?: string;
    gender?: 'male' | 'female' | 'other' | string;
};
export type UpdatePatientDTO = {
    accountId?: string;
    name?: string;
    dob?: string;
    phone?: string;
    address?: string;
    gender?: 'male' | 'female' | 'other' | string;
};



const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';
const API = `${BASE_URL}/patients`;

// List patients with pagination/query support
export async function getPatients(params: PatientQuery = {}): Promise<{ items: Patient[]; meta: PatientMeta | null }> {
    const url = `${API}`;
    const res = await axios.get(url, { params });
    const items: Patient[] = res?.data?.data ?? res?.data?.patients ?? res?.data?.items ?? res?.data ?? [];
    const meta: PatientMeta | null = res?.data?.meta ?? null;
    return { items, meta };
}

// Auth-like endpoints (if your patients auth is separate)
export async function registerPatient(dto: CreatePatientDto): Promise<Patient> {
    const url = `${API}/register`;
    const res = await axios.post(url, dto);
    return res?.data?.data ?? res?.data;
}

export async function loginPatient(payload: { phone?: string; email?: string; password: string }): Promise<any> {
    const url = `${API}/login`;
    const res = await axios.post(url, payload);
    return res?.data?.data ?? res?.data;
}

export async function logoutPatient(): Promise<void> {
    const url = `${API}/logout`;
    await axios.get(url);
}

export async function forgotPassword(payload: { phone?: string; email?: string }): Promise<any> {
    const url = `${API}/password/forgot`;
    const res = await axios.post(url, payload);
    return res?.data?.data ?? res?.data;
}

export async function otpPassword(payload: { phone?: string; email?: string; otp: string }): Promise<any> {
    const url = `${API}/password/otp`;
    const res = await axios.post(url, payload);
    return res?.data?.data ?? res?.data;
}

export async function resetPassword(payload: { phone?: string; email?: string; otp: string; newPassword: string }): Promise<any> {
    const url = `${API}/password/reset`;
    const res = await axios.post(url, payload);
    return res?.data?.data ?? res?.data;
}

// CRUD helpers
export async function createPatient(dto: CreatePatientDto): Promise<Patient> {
    const url = `${API}`;
    const res = await axios.post(url, dto);
    return res?.data?.data ?? res?.data;
}

export async function deletePatient(id: string): Promise<void> {
    const url = `${API}/${id}`;
    await axios.delete(url);
}

export async function getPatient(id: string): Promise<Patient> {
    const url = `${API}/${id}`;
    const res = await axios.get(url);
    return res?.data?.data ?? res?.data;
}

export async function getAllPatients(): Promise<Patient[]> {
    const url = `${API}`;
    const res = await axios.get(url);
    return res?.data?.data ?? res?.data;
}


export async function getPatientByAccountId(accountId: string): Promise<Patient | null> {
    const url = `/patients/account/${accountId}`;
    const res = await api.get(url);
    return res?.data ?? null;
}

// update patient info
export async function updatePatient(patientId: string, data: UpdatePatientDTO): Promise<Patient> {
    const url = `/patients/${patientId}`;
    const res = await api.put(url, data);
    return res.data;
}