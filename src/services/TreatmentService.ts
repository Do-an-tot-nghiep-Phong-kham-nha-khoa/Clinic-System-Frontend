import axios from "axios";

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export type CreateTreatmentDto = {
    healthProfile: string;
    doctor: string;
    appointment: string;
    treatmentDate?: string;   // ISO date string
    diagnosis: string;
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    symptoms: string;

    // optional
    prescription?: string | null;
    laborder?: string | null;
};

export async function createTreatment(data: CreateTreatmentDto) {
    const url = `${BASE_URL}/treatments`;
    return axios.post(url, data);
}
