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

export async function getHealthProfileByPatientId(patientId: string): Promise<HealthProfile | null> {
    const url = `${BASE_URL}/health-profiles/${patientId}`;
    try {
        const res = await axios.get(url);
        return res?.data?.data ?? res?.data ?? null;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 404) {
            return null;
        }
        throw error;
    }
}