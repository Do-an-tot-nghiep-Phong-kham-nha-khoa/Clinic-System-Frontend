import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export async function getAvailableBySpecialty(
    specialtyId: string,
    date: string,
    shift?: "morning" | "afternoon" | "evening"
) {
    let url = `${BASE_URL}/schedules/specialty/${specialtyId}/${date}`;

    if (shift) {
        url += `?shift=${shift}`;
    }

    const res = await axios.get(url);
    return res.data; // [{startTime, endTime, doctor_ids:[...] }]
}