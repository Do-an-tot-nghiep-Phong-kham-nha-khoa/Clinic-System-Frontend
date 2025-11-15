import api from './Api';

export type InvoiceStatus = 'Paid' | 'Cancelled' | 'Pending' | 'Refunded';

export type OwnerDetail = {
    name: string;
    dob: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
};

export type MedicineItem = {
    _id: string;
    medicineId: string;
    medicine: {
        _id: string;
        name: string;
        price: number;
    };
};

export type PrescriptionInfo = {
    _id: string;
    totalPrice: number;
    quantity: number;
    items: MedicineItem[];
};

export type ServiceItem = {
    _id: string;
    quantity: number;
    serviceId: string;
    service: {
        _id: string;
        name: string;
        price: number;
    };
};

export type LabOrderInfo = {
    _id: string;
    totalPrice: number;
    items: ServiceItem[];
};

export type Invoice = {
    _id: string;
    created_at: string;
    totalPrice: number;
    status: InvoiceStatus;

    // Thông tin bệnh nhân đã populate
    healthProfile_id: string;
    owner_detail: OwnerDetail;

    // Chi tiết đơn thuốc (có thể null)
    prescription: PrescriptionInfo | null;
    prescriptionId?: string; // ID gốc

    // Chi tiết đơn xét nghiệm (có thể null)
    labOrder: LabOrderInfo | null;
    labOrderId?: string; // ID gốc
};

export type InvoiceMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

// Phân trang và lọc
export type InvoiceQuery = {
    page?: number;
    limit?: number;
    sort?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    q?: string;
    status?: InvoiceStatus;
    dateFrom?: string;
    dateTo?: string;
    id?: string;
};

export type UpdateInvoiceStatusDto = {
    status: InvoiceStatus;
};

export type CreateInvoiceDto = {
    patientId: string;
    status?: InvoiceStatus; // Mặc định là 'Pending' trong backend, nhưng vẫn cho phép gửi
    prescriptionId?: string | null;
    labOrderId?: string | null;
};

// Lấy danh sách hóa đơn với phân trang và lọc
export async function getInvoices(params: InvoiceQuery = {}): Promise<{ items: Invoice[]; meta: InvoiceMeta | null }> {
    const url = `/invoices`;
    const res = await api.get(url, { params });
    const items: Invoice[] = res?.data?.data ?? [];
    const meta: InvoiceMeta | null = res?.data?.meta ?? null;
    return { items, meta };
}

// Lấy chi tiết một hóa đơn theo ID
export async function getInvoiceById(id: string): Promise<Invoice> {
    const url = `/invoices/${id}`;
    const res = await api.get(url);
    return res?.data ?? res?.data?.data;
}

// Lấy danh sách hóa đơn theo Patient ID
export async function getInvoicesByPatientId(patientId: string): Promise<Invoice[]> {
    const url = `/invoices/patient`;
    const res = await api.get(url, { params: { patientId } });
    return res?.data?.data ?? [];
}

// Câp nhật trạng thái của một hóa đơn
export async function updateInvoiceStatus(id: string, dto: UpdateInvoiceStatusDto): Promise<Invoice> {
    const url = `/invoices/${id}/status`;
    const res = await api.patch(url, dto);
    return res?.data ?? res?.data?.data;
}

// Tạo mới một hóa đơn
export async function createInvoice(dto: CreateInvoiceDto): Promise<Invoice> {
    const url = `/invoices`;
    const res = await api.post(url, dto);
    return res?.data ?? res?.data?.data;
}