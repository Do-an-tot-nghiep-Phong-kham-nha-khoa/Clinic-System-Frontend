import { message, Steps, Typography } from 'antd';
import { useState } from 'react';
import { FaCalendarAlt, FaCalendarCheck, FaUserCheck, FaUserMd } from 'react-icons/fa';
import ChooseDoctor from '../../components/Patient/AppointmentDoctor/ChooseDoctor';
import ChooseDateAndTime from '../../components/Patient/AppointmentSpecialty/ChooseDateAndTime';
import ChooseHealthProfile from '../../components/Patient/AppointmentSpecialty/ChooseHealthProfile';
import ConfirmAppointmentDoctor from '../../components/Patient/AppointmentDoctor/ConfirmAppointmentDoctor';
import { getDoctorById } from '../../services/DoctorService';
import SuccessScreenDoctor from '../../components/Patient/AppointmentDoctor/SuccessScreenDoctor';
import { type Patient as HealthProfile } from '../../services/PatientService';

const { Title } = Typography;

const APPOINTMENT_STEPS = [
    { title: 'Bác sĩ', icon: <FaUserMd />, description: 'Chọn bác sĩ' },
    { title: 'Thời gian & Ca khám', icon: <FaCalendarAlt />, description: 'Chọn ngày và giờ khám' },
    { title: 'Thông tin cá nhân', icon: <FaUserCheck />, description: 'Chọn hồ sơ sức khỏe' },
    { title: 'Xác nhận', icon: <FaCalendarCheck />, description: 'Hoàn tất đặt lịch' },
];

interface SelectedDoctor { id: string; name: string }

const PatientAppointmentDoctor = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedDoctor, setSelectedDoctor] = useState<SelectedDoctor | null>(null);
    const [selectedDateTime, setSelectedDateTime] = useState<{ date: string; timeSlot: string } | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<HealthProfile | null>(null);
    const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleDoctorSelected = async (doctorId: string) => {
        setLoading(true);
        try {
            const doc = await getDoctorById(doctorId);
            if (doc && doc.name) {
                setSelectedDoctor({ id: doctorId, name: doc.name });
                setCurrentStep(1);
            } else {
                message.error('Không lấy được thông tin bác sĩ');
            }
        } catch (e) {
            message.error('Lỗi khi lấy thông tin bác sĩ');
        } finally {
            setLoading(false);
        }
    };

    const handleTimeSlotSelected = (date: string, timeSlot: string) => {
        setSelectedDateTime({ date, timeSlot });
        setCurrentStep(2);
    };

    const handleProfileSelected = (profile: HealthProfile) => {
        setSelectedProfile(profile);
        setCurrentStep(3);
    };

    const handleAppointmentSuccess = () => {
        setIsAppointmentSuccess(true);
        setCurrentStep(4);
    };

    const renderStepContent = () => {
        if (isAppointmentSuccess && selectedDoctor && selectedDateTime && selectedProfile) {
            return (
                <SuccessScreenDoctor
                    appointmentInfo={{ doctorName: selectedDoctor.name, date: selectedDateTime.date, timeSlot: selectedDateTime.timeSlot, patientName: selectedProfile.name }}
                />
            );
        }

        switch (currentStep) {
            case 0:
                return <ChooseDoctor onNext={handleDoctorSelected} selectedDoctorId={selectedDoctor?.id || null} />;
            case 1:
                if (loading || !selectedDoctor) return <div>Vui lòng quay lại Bước 1 để chọn bác sĩ.</div>;
                return <ChooseDateAndTime specialtyId={''} onNext={handleTimeSlotSelected} onBack={() => setCurrentStep(0)} />;
            case 2:
                if (loading || !selectedDoctor || !selectedDateTime) return <div>Dữ liệu thiếu. Vui lòng quay lại.</div>;
                return <ChooseHealthProfile specialtyId={''} date={selectedDateTime.date} timeSlot={selectedDateTime.timeSlot} specialtyName={selectedDoctor.name} onNext={handleProfileSelected} onBack={() => setCurrentStep(1)} />;
            case 3:
                if (loading || !selectedDoctor || !selectedDateTime || !selectedProfile) return <div>Dữ liệu thiếu. Vui lòng quay lại.</div>;
                return <ConfirmAppointmentDoctor doctorId={selectedDoctor.id} doctorName={selectedDoctor.name} dateTime={selectedDateTime} profile={selectedProfile} onBack={() => setCurrentStep(2)} onSuccess={handleAppointmentSuccess} />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <Title level={2} className="text-center !mb-6 !font-bold">Đặt Lịch Khám Theo Bác Sĩ</Title>
            <div className="mb-8"><Steps current={currentStep} items={APPOINTMENT_STEPS} /></div>
            <div className="bg-white p-6 shadow-md rounded-lg">{renderStepContent()}</div>
        </div>
    );
};

export default PatientAppointmentDoctor;
