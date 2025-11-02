import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export type Patient = {
    _id: string;
    accountId: string;
    name: string;
    dob: string;
    phone: string;
};

export async function getPatientByAccountId(accountId: string): Promise<Patient | null> {
    const url = `${BASE_URL}/patients/account/${accountId}`;
    const res = await axios.get(url);
    return res?.data ?? null;
}