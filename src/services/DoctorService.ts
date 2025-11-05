import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export type Specialty = {
  _id: string;
  name: string;
};

export type Doctor = {
  _id: string;
  name: string;
  specialtyId?: Specialty; // backend trả về object { _id, name }
  avatar?: string;
  title?: string;
  experience?: string;
};

export async function getDoctors(specialtyId?: string): Promise<Doctor[]> {
  try {
    const url = specialtyId
      ? `${BASE_URL}/doctors/specialty/${specialtyId}`
      : `${BASE_URL}/doctors`;
    const res = await axios.get(url);

    // backend trả về { message, data: [...] }
    const data = res?.data?.data;
    if (Array.isArray(data)) return data as Doctor[];

    console.warn('getDoctors: unexpected response shape', res.data);
    return [];
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }
}

export async function getDoctorById(doctorId: string): Promise<Doctor | null> {
  try {
    const url = `${BASE_URL}/doctors/${doctorId}`;
    const res = await axios.get(url);
    const doctor = res?.data?.data?.doctor;

    if (doctor && doctor._id) return doctor as Doctor;

    console.warn('getDoctorById: unexpected response shape', res.data);
    return null;
  } catch (error) {
    console.error('Error fetching doctor by id:', error);
    return null;
  }
}
