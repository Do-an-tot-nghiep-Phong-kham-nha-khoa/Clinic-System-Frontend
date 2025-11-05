import { message, Steps, Typography } from "antd";
import { useState } from "react";
import { FaCalendarAlt, FaCalendarCheck, FaUserCheck, FaUserMd } from "react-icons/fa";
import ChooseDoctor from "../../components/Patient/Appointment/ChooseDoctor";
import ChooseDateAndTime from "../../components/Patient/Appointment/ChooseDateAndTime";
// selectedProfile will be a presentation object where _id is healthProfile id and includes patient info
import ChooseHealthProfile from "../../components/Patient/Appointment/ChooseHealthProfile";
import ConfirmAppointment from "../../components/Patient/Appointment/ConfirmAppointment";
import { getDoctorById } from "../../services/DoctorService";
import { getSpecialtyById } from "../../services/SpecialtyService";
import SuccessScreen from "../../components/Patient/Appointment/SucessScreen";

const { Title } = Typography;

const APPOINTMENT_STEPS = [
    {
        title: 'Chọn bác sĩ',
        icon: <FaUserMd />,
        description: 'Chọn bác sĩ bạn muốn khám'
    },
    {
        title: 'Thời gian & Ca khám',
        icon: <FaCalendarAlt />,
        description: 'Chọn ngày và giờ khám'
    },
    {
        title: 'Thông tin cá nhân',
        icon: <FaUserCheck />,
        description: 'Chọn hồ sơ sức khỏe'
    },
    {
        title: 'Xác nhận',
        icon: <FaCalendarCheck />,
        description: 'Hoàn tất đặt lịch'
    },
];

interface SelectedDoctor {
    id: string;
    name: string; // doctor's full name
    specialtyId?: string; // specialty id (if available)
    specialtyName?: string; // human readable specialty name
}

const PatientAppointmentDoctor = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedDoctor, setSelectedDoctor] = useState<SelectedDoctor | null>(null);
    const [selectedDateTime, setSelectedDateTime] = useState<{ date: string; timeSlot: string } | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<any | null>(null);
    const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Khi người dùng chọn bác sĩ và tiếp tục
    const handleDoctorSelected = async (doctorId: string) => {
        setLoading(true);
        try {
            const doctorData = await getDoctorById(doctorId);
            console.debug('getDoctorById returned:', doctorData);

            if (doctorData) {
                const docName = (doctorData as any).name || (doctorData as any).doctor?.name || '';
                let spec = (doctorData as any).specialtyId || (doctorData as any).doctor?.specialtyId || null;
                let specId = spec ? (spec._id || spec) : undefined;
                let specName = spec ? (spec.name || undefined) : undefined;

                // If specialty name is not populated, fetch it
                if (!specName && specId) {
                    try {
                        const sp = await getSpecialtyById(specId);
                        if (sp && sp.name) specName = sp.name;
                    } catch (err) {
                        console.warn('Không lấy được tên chuyên khoa phụ trợ:', err);
                    }
                }

                setSelectedDoctor({ id: doctorId, name: docName, specialtyId: specId, specialtyName: specName });
                setCurrentStep(1);
            } else {
                console.warn('Doctor data missing name or unexpected shape:', doctorData);
                message.error("Không thể lấy thông tin tên bác sĩ. Vui lòng thử lại hoặc kiểm tra API (xem console/network).");
            }
        } catch (error) {
            console.error("Lỗi khi fetch Doctor Name:", error);
            message.error("Lỗi hệ thống khi tải thông tin bác sĩ.");
        } finally {
            setLoading(false);
        }
    };

    const handleTimeSlotSelected = (date: string, timeSlot: string) => {
        setSelectedDateTime({ date, timeSlot });
        setCurrentStep(2);
    };

    const handleProfileSelected = (profile: any) => {
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
                <SuccessScreen
                    appointmentInfo={{
                        doctorName: selectedDoctor.name,
                        specialtyName: selectedDoctor.specialtyName || '',
                        date: selectedDateTime.date,
                        timeSlot: selectedDateTime.timeSlot,
                        patientName: selectedProfile.name
                    }}
                />
            );
        }

        switch (currentStep) {
            case 0:
                return (
                    <ChooseDoctor
                        onNext={handleDoctorSelected}
                        selectedDoctorId={selectedDoctor?.id || null}
                    />
                );
            case 1:
                if (loading || !selectedDoctor) return <div>Vui lòng quay lại Bước 1 để chọn bác sĩ.</div>;
                return (
                    <ChooseDateAndTime
                        specialtyId={selectedDoctor.specialtyId || ''}
                        onNext={handleTimeSlotSelected}
                        onBack={() => setCurrentStep(0)}
                    />
                );
            case 2:
                if (loading || !selectedDoctor || !selectedDateTime) return <div>Dữ liệu thiếu. Vui lòng quay lại.</div>;

                return (
                    <ChooseHealthProfile
                        specialtyId={selectedDoctor.specialtyId || ''}
                        date={selectedDateTime.date}
                        timeSlot={selectedDateTime.timeSlot}
                        specialtyName={selectedDoctor.specialtyName || ''}
                        doctorName={selectedDoctor.name}
                        onNext={handleProfileSelected}
                        onBack={() => setCurrentStep(1)}
                    />
                );
            case 3:
                if (loading || !selectedDoctor || !selectedDateTime || !selectedProfile) return <div>Dữ liệu thiếu. Vui lòng quay lại.</div>;

                return (
                    <ConfirmAppointment
                        specialtyId={selectedDoctor.specialtyId || ''}
                        doctorId={selectedDoctor.id}
                        dateTime={selectedDateTime}
                        profile={selectedProfile}
                        specialtyName={selectedDoctor.specialtyName || ''}
                        doctorName={selectedDoctor.name}
                        onBack={() => setCurrentStep(2)}
                        onSuccess={handleAppointmentSuccess}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">
            <Title level={2} className="text-center !mb-6 !font-bold">Đặt Lịch Khám Theo Bác Sĩ</Title>

            <div className="mb-8">
                <Steps current={currentStep} items={APPOINTMENT_STEPS} />
            </div>

            <div className="bg-white p-6 shadow-md rounded-lg">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default PatientAppointmentDoctor;
