import { Button, message, Steps, Typography } from "antd";
import { useState } from "react";
import { FaCalendarAlt, FaCalendarCheck, FaUserCheck, FaUserMd } from "react-icons/fa";
import ChooseSpecialty from "../../components/Patient/AppointmentSpecialty/ChooseSpecialty";
import ChooseDateAndTime from "../../components/Patient/AppointmentSpecialty/ChooseDateAndTime";
import { type Patient as HealthProfile } from "../../services/PatientService";
import ChooseHealthProfile from "../../components/Patient/AppointmentSpecialty/ChooseHealthProfile";
import ConfirmAppointment from "../../components/Patient/AppointmentSpecialty/ConfirmAppointment";
import { getSpecialtyById, type Specialty } from "../../services/SpecialtyService";
import SuccessScreen from "../../components/Patient/AppointmentSpecialty/SucessScreen";

const { Title } = Typography;

const APPOINTMENT_STEPS = [
    {
        title: 'Chuyên khoa',
        icon: <FaUserMd />,
        description: 'Chọn chuyên khoa khám'
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

interface SelectedSpecialty {
    id: string;
    name: string;
}

const PatientAppointmentSpecialty = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedSpecialty, setSelectedSpecialty] = useState<SelectedSpecialty | null>(null);
    const [selectedDateTime, setSelectedDateTime] = useState<{ date: string; timeSlot: string } | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<HealthProfile | null>(null);
    const [isAppointmentSuccess, setIsAppointmentSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Hàm xử lý khi người dùng chọn chuyên khoa và chuyển sang bước tiếp theo
    const handleSpecialtySelected = async (specialtyId: string) => {
        setLoading(true);
        try {
            const specialtyData = await getSpecialtyById(specialtyId);

            if (specialtyData && specialtyData.name) {
                setSelectedSpecialty({
                    id: specialtyId,
                    name: specialtyData.name
                });
                setCurrentStep(1);
            } else {
                message.error("Không thể lấy thông tin tên chuyên khoa.");
            }
        } catch (error) {
            console.error("Lỗi khi fetch Specialty Name:", error);
            message.error("Lỗi hệ thống khi tải thông tin chuyên khoa.");
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

    // Hàm render nội dung bước hiện tại
    const renderStepContent = () => {
        if (isAppointmentSuccess && selectedSpecialty && selectedDateTime && selectedProfile) {
            // RENDER MÀN HÌNH THÀNH CÔNG 
            return (
                <SuccessScreen
                    appointmentInfo={{
                        specialtyName: selectedSpecialty.name,
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
                    <ChooseSpecialty
                        onNext={handleSpecialtySelected}
                        selectedSpecialtyId={selectedSpecialty?.id || null}
                    />
                );
            case 1:
                if (loading || !selectedSpecialty) return <div>Vui lòng quay lại Bước 1 để chọn Chuyên khoa.</div>;
                return (
                    <ChooseDateAndTime
                        specialtyId={selectedSpecialty.id}
                        onNext={handleTimeSlotSelected}
                        onBack={() => setCurrentStep(0)}
                    />
                );
            case 2:
                if (loading || !selectedSpecialty || !selectedDateTime) return <div>Dữ liệu thiếu. Vui lòng quay lại.</div>;

                return (
                    <ChooseHealthProfile
                        specialtyId={selectedSpecialty.id}
                        date={selectedDateTime.date}
                        timeSlot={selectedDateTime.timeSlot}
                        specialtyName={selectedSpecialty.name}
                        onNext={handleProfileSelected}
                        onBack={() => setCurrentStep(1)}
                    />
                );
            case 3:
                if (loading || !selectedSpecialty || !selectedDateTime || !selectedProfile) return <div>Dữ liệu thiếu. Vui lòng quay lại.</div>;

                return (
                    <ConfirmAppointment
                        specialtyId={selectedSpecialty.id}
                        dateTime={selectedDateTime}
                        profile={selectedProfile}
                        specialtyName={selectedSpecialty.name}
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
            <Title level={2} className="text-center !mb-6 !font-bold">Đặt Lịch Khám Theo Chuyên Khoa</Title>

            {/* Steps Component: Hiển thị tiến trình */}
            <div className="mb-8">
                <Steps current={currentStep} items={APPOINTMENT_STEPS} />
            </div>

            {/* Nội dung của bước hiện tại */}
            <div className="bg-white p-6 shadow-md rounded-lg">
                {renderStepContent()}
            </div>
        </div>
    );
};

export default PatientAppointmentSpecialty;