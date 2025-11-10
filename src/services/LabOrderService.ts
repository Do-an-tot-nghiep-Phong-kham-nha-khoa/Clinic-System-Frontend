import axios from "axios";

const BASE_URL = import.meta.env.BACKEND_URL || "http://localhost:3000";

export type LabOrderItemInput = {
    serviceId: string;
    quantity: number;
    description?: string;
};

export type CreateLabOrderInput = {
    testTime: string; // ISO string
    healthProfile_id: string;
    items: LabOrderItemInput[];
};

export async function createLabOrder(data: CreateLabOrderInput) {
    const url = `${BASE_URL}/laborders`;
    const res = await axios.post(url, data);
    return res?.data;
}
