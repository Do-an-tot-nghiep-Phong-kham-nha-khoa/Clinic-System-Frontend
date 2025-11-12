import axios from 'axios';
import api from './Api';
const URL = `/schedules`;

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
    const url = `${URL}/specialty/${encodeURIComponent(specialtyId)}/${encodeURIComponent(date)}`;
    const res = await api.get(url);
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
        const url = `${URL}/${doctorId}`;
        const res = await api.get(url);

        const data = res?.data;
        if (!data) return [];

        return Array.isArray(data) ? data : [];
    } catch (e: any) {
        if (e?.response?.status === 404) return [];
        console.error("getDoctorSchedule error:", e);
        return [];
    }
}
export async function getAvailableBySpecialty(
    specialtyId: string,
    date: string,
    shift?: "morning" | "afternoon" | "evening"
) {
    let url = `${URL}/specialty/${specialtyId}/${date}`;

    if (shift) {
        url += `?shift=${shift}`;
    }

    const res = await api.get(url);
    return res.data; // [{startTime, endTime, doctor_ids:[...] }]
}
/* ---------------------------------------------------
   GET: /schedules/:doctorId/:date
---------------------------------------------------- */
export async function getDoctorScheduleByDate(doctorId: string, date: string, shift?: 'morning' | 'afternoon') {
    let url = `${URL}/${doctorId}/${encodeURIComponent(date)}`;
    if (shift) url += `?shift=${shift}`;
    const res = await api.get(url);
    return res?.data ?? [];
}
export async function getAvailableSlotsByDoctor(doctorId: string, date: string, shift?: 'morning' | 'afternoon') {
    return getDoctorScheduleByDate(doctorId, date, shift);
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
        const res = await api.get(`${URL}/available-doctors`, {
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
    const res = await api.post(URL, payload);
    return res?.data ?? null;
}

export default {} as const;
