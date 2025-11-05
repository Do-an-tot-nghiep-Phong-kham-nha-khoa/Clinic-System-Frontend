import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export interface HealthProfile {
    _id: string;
    patientId: string;
    height?: number;
    weight?: number;
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
    createdAt: string;
}

export async function getHealthProfileByPatientId(patientId: string): Promise<HealthProfile[] | null> {
    const url = `${BASE_URL}/health-profiles/${patientId}`;
    try {
        const res = await axios.get(url);
        // support both wrapped { data: [...] } and direct array
        const data = res?.data?.data ?? res?.data ?? null;
        if (!data) return null;
        // If server returned a single profile, normalize to array
        if (!Array.isArray(data)) return [data as HealthProfile];
        return data as HealthProfile[];
    } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
}

export interface CreateHealthProfilePayload {
    height?: number;
    weight?: number;
    bloodType?: string;
    allergies?: string[];
    chronicConditions?: string[];
    medications?: string[];
    emergencyContact?: {
        name?: string;
        relationship?: string;
        phone?: string;
    };
}

export async function createHealthProfile(patientId: string, payload: CreateHealthProfilePayload) {
    const url = `${BASE_URL}/health-profiles/${patientId}?ownerModel=Patient`;
    const res = await axios.post(url, payload);
    // backend returns { message, profile }
    return res?.data?.profile ?? res?.data ?? null;
}