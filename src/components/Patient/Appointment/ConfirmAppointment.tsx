import { Button, Card, Descriptions, Input, Typography, message, Spin, notification } from 'antd';
import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import dayjs from 'dayjs';
import { createAppointment, type AppointmentPayload } from '../../../services/AppointmentService';
import { useAuth } from '../../../contexts/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface ConfirmAppointmentProps {
    specialtyId: string;
    specialtyName: string;
    dateTime: { date: string; timeSlot: string };
    // profile is the healthProfile presentation object (contains _id and patient info)
    profile: any;
    doctorName?: string;
    doctorId?: string;
    onBack: () => void;
    onSuccess: () => void;
}

const ConfirmAppointment: React.FC<ConfirmAppointmentProps> = ({ specialtyId, specialtyName, dateTime, profile, doctorName, doctorId, onBack, onSuccess }) => {
    const { user } = useAuth();
    const [reason, setReason] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // Xử lý gửi lịch hẹn
    const handleSubmit = async () => {
        if (!reason || reason.trim().length < 2) {
            message.warning("Vui lòng nhập lý do khám chi tiết (ít nhất 2 ký tự).");
            return;
        }

        if (!user?.id) {
            message.error("Không tìm thấy thông tin người đặt lịch (Booker ID).");
            return;
        }

        const appointmentDateISO = dayjs(dateTime.date).startOf('day').toISOString();

        const payload: AppointmentPayload = {
            booker_id: user.id,
            healthProfile_id: profile._id,
            doctor_id: doctorId,
            specialty_id: specialtyId,
            appointmentDate: appointmentDateISO,
            timeSlot: dateTime.timeSlot,
            reason: reason.trim() || 'Trống',
        };

        setLoading(true);
        try {
            await createAppointment(payload);

            notification.success({
                message: 'Đặt lịch thành công!',
                description: `Lịch hẹn khám cho bệnh nhân ${profile.name} đã được xác nhận.`,
                icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
            });
            onSuccess(); // Chuyển đến màn hình thông báo thành công
        } catch (error: any) {
            notification.error({
                message: 'Đặt lịch thất bại',
                description: error.message || "Đã xảy ra lỗi trong quá trình gửi yêu cầu.",
                icon: <FaExclamationTriangle style={{ color: '#faad14' }} />,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 mx-auto">
            <Title level={3} className="!mb-6 text-center">4. Xác nhận Đặt lịch Khám</Title>

            <Card title="Thông tin Lịch hẹn" variant='outlined' className="mb-6 ">
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Bác sĩ" labelStyle={{ fontWeight: 'bold' }}>
                        {doctorName || '---'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Chuyên khoa" labelStyle={{ fontWeight: 'bold' }}>
                        {specialtyName}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày khám" labelStyle={{ fontWeight: 'bold' }}>
                        {dayjs(dateTime.date).format('dddd, DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Khung giờ" labelStyle={{ fontWeight: 'bold' }}>
                        {dateTime.timeSlot}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Thông tin Hồ sơ Sức khỏe" variant='outlined' className="mb-6 bg-blue-50">
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Tên Bệnh nhân" labelStyle={{ fontWeight: 'bold' }}>
                        {profile.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh" labelStyle={{ fontWeight: 'bold' }}>
                        {dayjs(profile.dob).format('DD/MM/YYYY')}
                    </Descriptions.Item>
                    <Descriptions.Item label="SĐT" labelStyle={{ fontWeight: 'bold' }}>
                        {profile.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="email" labelStyle={{ fontWeight: 'bold' }}>
                        {user?.email || 'Chưa có'}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <div className="mb-6 mt-4">
                <Title level={5} className="!mb-2">Lý do khám bệnh <Text type="danger">*</Text></Title>
                <TextArea
                    rows={4}
                    placeholder="Vui lòng mô tả chi tiết lý do bạn cần đặt lịch khám..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={loading}
                />
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
                <Button
                    onClick={onBack}
                    icon={<FaArrowLeft />}
                    disabled={loading}
                >
                    Quay lại (Sửa Hồ sơ)
                </Button>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={loading}
                    icon={loading ? <Spin size="small" /> : <FaCheckCircle />}
                    disabled={!reason || reason.trim().length < 1}
                >
                    Xác nhận Đặt lịch
                </Button>
            </div>
        </div>
    );
};

export default ConfirmAppointment;