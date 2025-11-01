import axios from 'axios';

export type Account = {
    _id?: string;
    // primary identifier fields from backend
    email: string;
    password?: string; // usually present only on create responses are omitted
    // roles stored as array of ObjectId strings in your JSON
    roleId?: string[];
    // record status / soft-delete
    status?: string;
    deleted?: boolean;
    // timestamps from backend (ISO strings)
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
};

export type AccountMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
};

export type AccountQuery = {
    page?: number;
    limit?: number;
    sort?: string;
    q?: string;
};

export type CreateAccountDto = {
    email: string;
    password: string;
    roleId?: string[];
    status?: string;
};

export type UpdateAccountDto = Partial<CreateAccountDto> & { deleted?: boolean };

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';
const API = `${BASE_URL}/accounts`;

export async function getAccounts(params: AccountQuery = {}): Promise<{ items: Account[]; meta: AccountMeta | null }> {
    const url = `${API}`;
    const res = await axios.get(url, { params });
    // normalize response shapes: support { data: [...] }, { items: [...] }, { users: [...] }, { accounts: [...] }
    const items: Account[] = res?.data?.data ?? res?.data?.accounts ?? res?.data?.items ?? res?.data?.users ?? [];
    const meta: AccountMeta | null = res?.data?.meta ?? null;
    console.log("Get Accounts Response:", res);
    return { items, meta };
}

// Auth related endpoints
export async function registerAccount(dto: CreateAccountDto): Promise<Account> {
    const url = `${API}/register`;
    const res = await axios.post(url, dto);
    console.log("Register Account Response:", res);
    return res?.data?.data ?? res?.data;
}

export async function loginAccount(payload: { email: string; password: string }): Promise<any> {
    const url = `${API}/login`;
    const res = await axios.post(url, payload);
    return res?.data?.data ?? res?.data;
}

export async function logoutAccount(): Promise<void> {
    const url = `${API}/logout`;
    await axios.get(url);
}

export async function forgotPassword(payload: { email: string }): Promise<any> {
    const url = `${API}/password/forgot`;
    const res = await axios.post(url, payload);
    return res?.data?.data ?? res?.data;
}

export async function otpPassword(payload: { email: string; otp: string }): Promise<any> {
    const url = `${API}/password/otp`;
    const res = await axios.post(url, payload);
    return res?.data?.data ?? res?.data;
}

export async function resetPassword(payload: { email: string; otp: string; newPassword: string }): Promise<any> {
    const url = `${API}/password/reset`;
    const res = await axios.post(url, payload);
    return res?.data?.data ?? res?.data;
}

// CRUD helpers
export async function createAccount(dto: CreateAccountDto): Promise<Account> {
    // use the auth register endpoint for creation
    return registerAccount(dto);
}

export async function updateAccount(id: string, dto: UpdateAccountDto): Promise<Account> {
    const url = `${API}/${id}`;
    const res = await axios.put(url, dto);
    return res?.data?.data ?? res?.data;
}

export async function deleteAccount(id: string): Promise<void> {
    const url = `${API}/${id}`;
    await axios.delete(url);
}

export async function getAccount(id: string): Promise<Account> {
    const url = `${API}/${id}`;
    const res = await axios.get(url);
    return res?.data?.data ?? res?.data;
}
