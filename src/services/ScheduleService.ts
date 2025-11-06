import axios from 'axios';

const BASE_URL = import.meta.env.BACKEND_URL || 'http://localhost:3000';
const API = `${BASE_URL}/schedules`;

export type TimeSlot = {
    startTime: string;
    endTime: string;
    isBooked?: boolean;
}

export type ScheduleEntry = {
    _id?: string;
    doctorId: string;
    date: string;          // "YYYY-MM-DD"
    timeSlots: TimeSlot[];
};

export type DoctorAvailability = {
    doctorId: string;
    name?: string;
};
export type AvailableSlot = {
    doctor_id: string;
    startTime: string;
    endTime: string;
    doctor_name?: string;
};

export async function getAvailableTimeSlotsBySpecialty(
    specialtyId: string,
    date: string
): Promise<AvailableSlot[]> {
    const url = `${API}/specialty/${encodeURIComponent(specialtyId)}/${encodeURIComponent(date)}`;
    const res = await axios.get(url, { withCredentials: true });
    const body = res?.data ?? [];
    if (Array.isArray(body)) return body as AvailableSlot[];
    if (Array.isArray(body?.data)) return body.data as AvailableSlot[];
    return [];
}
/* ---------------------------------------------------
   GET: /schedules/:doctorId
---------------------------------------------------- */
export async function getDoctorSchedule(doctorId: string): Promise<ScheduleEntry[]> {
    try {
        const url = `${API}/${doctorId}`;
        const res = await axios.get(url, { withCredentials: true });

        const data = res?.data;
        if (!data) return [];

        return Array.isArray(data) ? data : [];
    } catch (e: any) {
        if (e?.response?.status === 404) return [];
        console.error("getDoctorSchedule error:", e);
        return [];
    }
}

/* ---------------------------------------------------
   GET: /schedules/:doctorId/:date
---------------------------------------------------- */
export async function getDoctorScheduleByDate(
    doctorId: string,
    date: string
): Promise<TimeSlot[]> {
    try {
        const url = `${API}/${doctorId}/${encodeURIComponent(date)}`;
        const res = await axios.get(url, { withCredentials: true });

        const data = res?.data;

        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.availableSlots)) return data.availableSlots;

        return [];
    } catch (e: any) {
        if (e?.response?.status === 404) return [];
        console.error("getDoctorScheduleByDate error:", e);
        return [];
    }
}

/* ---------------------------------------------------
   GET: /schedules/available-doctors?specialtyId=...&date=...&timeSlot=...
---------------------------------------------------- */
export async function getAvailableDoctors(
    specialtyId: string,
    date: string,
    timeSlot: string
) {
    try {
        const res = await axios.get(`${API}/available-doctors`, {
            params: {
                specialty_id: specialtyId,
                date: date,           // phải là yyyy-mm-dd
                time_slot: timeSlot   // phải là "HH:MM-HH:MM"
            },
            withCredentials: true
        });

        return res.data;
    } catch (error) {
        console.error("getAvailableDoctors error:", error);
        return { doctors: [] };
    }
}
/* ---------------------------------------------------
   POST: /schedules
---------------------------------------------------- */
export async function createSchedule(payload: {
    doctorId: string;
    date: string;
    timeSlots: TimeSlot[];
}) {
    const res = await axios.post(API, payload, { withCredentials: true });
    return res?.data ?? null;
}

export default {} as const;
