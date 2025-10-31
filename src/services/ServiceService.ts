import axios from 'axios';

export type Service = {
    _id?: string;
    name: string;
    price: number;
    description?: string;
    created_at?: string;
};

export type ServiceMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type ServiceQuery = {
    page?: number;
    limit?: number;
    sort?: string;
    q?: string;
};

export type CreateServiceDto = Required<Pick<Service, 'name' | 'price' | 'description' | 'created_at'>>;
export type UpdateServiceDto = Partial<CreateServiceDto> & { name?: string };

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';

export async function getServices(params: ServiceQuery = {}): Promise<{ items: Service[]; meta: ServiceMeta | null }> {
    const url = `${BASE_URL}/services`;
    const res = await axios.get(url, { params });
    const items: Service[] = res?.data?.data ?? res?.data?.services ?? [];
    const meta: ServiceMeta | null = res?.data?.meta ?? null;
    return { items, meta };
}

export async function createService(dto: CreateServiceDto): Promise<Service> {
    const url = `${BASE_URL}/services`;
    const res = await axios.post(url, dto);
    return res?.data?.data ?? res?.data;
}

export async function updateService(id: string, dto: UpdateServiceDto): Promise<Service> {
    const url = `${BASE_URL}/services/${id}`;
    const res = await axios.put(url, dto);
    return res?.data?.data ?? res?.data;
}

export async function deleteService(id: string): Promise<void> {
    const url = `${BASE_URL}/services/${id}`;
    await axios.delete(url);
}

export async function getService(id: string): Promise<Service> {
    const url = `${BASE_URL}/services/${id}`;
    const res = await axios.get(url);
    return res?.data?.data ?? res?.data;
}
