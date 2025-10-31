type Doctor = {
    photo: string;
    name: string;
    specialty: string;
    clinic: string;
    degrees: string[];
    email: string;
};

type DoctorProfileCardProps = {
    doctor: Doctor;
};

function DoctorProfileCard({ doctor }: DoctorProfileCardProps) {
    return (
        <aside className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-3">
                <img src={doctor.photo} alt="avatar" className="w-14 h-14 rounded-full" />
                <div>
                    <div className="text-sm font-medium">{doctor.name}</div>
                    <div className="text-xs text-gray-500">{doctor.specialty}</div>
                </div>
            </div>


            <ul className="mt-4 text-sm space-y-2 text-gray-600">
                <li><strong>Đơn vị công tác:</strong> {doctor.clinic}</li>
                <li><strong>Bằng cấp:</strong> {doctor.degrees.join(', ')}</li>
                <li><strong>Email:</strong> {doctor.email}</li>
            </ul>
        </aside>
    )
}

export default DoctorProfileCard;