import api from './Api';

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