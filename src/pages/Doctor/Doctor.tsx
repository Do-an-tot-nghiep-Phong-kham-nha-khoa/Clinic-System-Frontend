
import DoctorHero from '../../components/Doctor/DoctorHero';
import DoctorCard from '../../components/Doctor/DoctorCard';
type Doctor = {
    photo: string;
    name: string;
    specialty: string;
    tagline: string;
    phone: string;
    clinic: string;
    degrees: string[];
    email: string;
    yearsExperience: number;
    rating: number;
};
    
const Doctor = () => {
    const doctor: Doctor = {
        photo: 'https://via.placeholder.com/150',
        name: 'Dr. John Doe',
        specialty: 'Cardiology',
        clinic: 'Heart Center',
        degrees: ['MD', 'PhD'],
        email: 'john.doe@example.com',
        tagline: 'Caring for your heart',
        phone: '123-456-7890',
        yearsExperience: 15,
        rating: 4.8,
    };

    return <div>
        <DoctorHero doctor={doctor} onBook={() => {}} />
        <DoctorCard doctor={doctor} />
    </div>
};

export default Doctor;