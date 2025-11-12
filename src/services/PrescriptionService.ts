import axios from "axios";

const BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:3000";

export type PrescriptionItemDto = {
    medicineId: string;
    quantity: number;
    dosage: string;
    frequency: string;
    duration: string;
    instruction: string;
}

export type CreatePrescriptionDto = {
    healthProfile_id: string;
    items: PrescriptionItemDto[];
}

export async function createPrescription(data: CreatePrescriptionDto) {
    const url = `${BASE_URL}/prescriptions`;
    const res = await axios.post(url, data);
    return res.data;
}
