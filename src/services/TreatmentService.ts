import api from "./Api";


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

export interface Doctor {
    _id: string;
    name: string;
    phone: string;
    specialtyId: {
        _id: string;
        name: string;
    };
}

export interface HealthProfile {
    ownerId: string;
    ownerModel: string;
    owner_detail: {
        _id: string;
        name: string;
        dob: string;
        gender: string;
        phone: string;
    };
}

export interface Appointment {
    _id: string;
    appointmentDate: string;
    timeSlot: string;
}

export interface LabOrder {
    _id: string;
    testTime: string;
    totalPrice: number;
    items: {
        serviceId: {
            _id: string;
            name: string;
            price: number;
        };
        quantity: number;
        description: string;
    }[];
}

export interface Prescription {
    _id: string;
    totalPrice: number;
    items: {
        medicineId: {
            _id: string;
            name: string;
            manufacturer: string;
            unit: string;
            expiryDate: string;
            price: number;
        };
        quantity: number;
        dosage: string;
        frequency: string;
        duration: string;
        instruction: string;
    }[];
}

export interface Treatment {
    _id: string;
    healthProfile: HealthProfile;
    doctor: Doctor;
    appointment: Appointment;
    treatmentDate: string;
    diagnosis: string;
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    symptoms: string;
    totalCost: number;
    laborder?: LabOrder | null;
    prescription?: Prescription | null;
}

export interface TreatmentMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TreatmentResponse {
    meta: TreatmentMeta;
    treatments: Treatment[];
}

export async function createTreatment(data: CreateTreatmentDto) {
    const url = `/treatments`;
    return api.post(url, data);
}

export async function getTreatmentsByBooker(
    bookerId: string,
    options?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        from?: string;
        to?: string;
    }
): Promise<TreatmentResponse> {
    const {
        page = 1,
        limit = 10,
        sortBy,
        sortOrder,
        from,
        to,
    } = options || {};

    const params: Record<string, string | number> = { page, limit };
    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (from) params.from = from;
    if (to) params.to = to;

    const url = `/treatments/booker/${bookerId}`;
    const response = await api.get<TreatmentResponse>(url, { params });
    return response.data;
}

export async function getTreatmentById(treatmentId: string): Promise<Treatment> {
    const url = `/treatments/${treatmentId}`;
    const response = await api.get<Treatment>(url);
    return response.data;
}