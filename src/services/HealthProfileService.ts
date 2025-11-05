import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export interface HealthProfile {
    _id: string;
    ownerId: string;
    ownerModel: 'Patient' | 'FamilyMember';
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
    familyMemberName?: string;
    familyMemberPhone?: string;
    relationship?: string;
    type: 'Patient' | 'FamilyMember';
    createdAt: string;
    updatedAt: string;
}

// Lấy tất cả hồ sơ sức khỏe của bệnh nhân theo Patient ID
export async function getAllHealthProfiles(patientId: string): Promise<HealthProfile[]> {
    const url = `${BASE_URL}/health-profiles/all/${patientId}`;
    try {
        const res = await axios.get(url);
        // API trả về list trực tiếp => return res.data
        return Array.isArray(res.data) ? res.data : [];
    } catch (error) {
        console.error('Error fetching health profiles:', error);
        throw error;
    }
}
