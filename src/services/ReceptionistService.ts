import api from './Api';

export type Receptionist = {
    _id: string;
    name: string;
    phone: string;
};

export async function getReceptionists(): Promise<Receptionist[]> {
    const url = `/receptionists`;
    const res = await api.get(url);
    return res?.data ?? [];
}

export async function getReceptionistById(receptionistId: string): Promise<Receptionist | null> {
    const url = `/receptionists/${receptionistId}`;
    try {
        const res = await api.get(url);
        return res?.data ?? null;
    } catch (error) {
        console.error("Lỗi khi lấy lễ tân theo ID:", error);
        return null;
    }
}

// Lấy lễ tân bằng account ID
export async function getReceptionistByAccountId(accountId: string): Promise<Receptionist | null> {
    const url = `/receptionists/byAccount/${accountId}`;
    try {
        const res = await api.get(url);
        return res?.data ?? null;
    } catch (error) {
        console.error("Lỗi khi lấy lễ tân theo account ID:", error);
        return null;
    }
}

export async function updateReceptionist(receptionistId: string, dto: Partial<Receptionist>): Promise<Receptionist | null> {
    const url = `${BASE_URL}/receptionists/${receptionistId}`;
    try {
        const res = await axios.put(url, dto);
        return res?.data ?? null;
    }
    catch (error) {
        console.error("Lỗi khi cập nhật lễ tân:", error);
        return null;
    }
}