import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export type Patient = {
    _id: string;
    accountId: string;
    name: string;
    dob: string;
    phone: string;
    gender?: string;
    address?: string;
};

export type UpdatePatientDTO = {
    name?: string;
    dob?: string;
    phone?: string;
    gender?: string;
    address?: string;
};

export async function getPatientByAccountId(accountId: string): Promise<Patient | null> {
    const url = `${BASE_URL}/patients/account/${accountId}`;
    const res = await axios.get(url);
    return res?.data ?? null;
}

// update patient info
export async function updatePatient(accountId: string, data: UpdatePatientDTO): Promise<Patient> {
    const url = `${BASE_URL}/patients/${accountId}`;
    const res = await axios.put(url, data);
    return res.data;
}