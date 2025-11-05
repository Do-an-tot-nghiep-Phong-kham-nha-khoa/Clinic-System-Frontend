import { Button, Card, Descriptions, Input, Typography, message, Spin, notification } from 'antd';
import React, { useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import dayjs from 'dayjs';
import { createAppointment } from '../../../services/AppointmentService';
import { type Patient as HealthProfile } from '../../../services/PatientService';
import { useAuth } from '../../../contexts/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Props {
    doctorId: string;
    doctorName: string;
    dateTime: { date: string; timeSlot: string };
    profile: HealthProfile;
    onBack: () => void;
    onSuccess: () => void;
}

const ConfirmAppointmentDoctor: React.FC<Props> = ({ doctorId, doctorName, dateTime, profile, onBack, onSuccess }) => {
    const { user } = useAuth();
    const [reason, setReason] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (!reason || reason.trim().length < 2) {
            message.warning('Vui lòng nhập lý do khám (ít nhất 2 ký tự)');
            return;
        }
        if (!user?.id) {
            message.error('Không tìm thấy thông tin người đặt lịch');
            return;
        }

        const appointmentDateISO = dayjs(dateTime.date).startOf('day').toISOString();

        const payload = {
            booker_id: user.id,
            profileId: profile._id,
            profileModel: 'Patient',
            doctor_id: doctorId,
            appointmentDate: appointmentDateISO,
            timeSlot: dateTime.timeSlot,
            reason: reason.trim() || 'Trống',
        };

        setLoading(true);
        try {
            await createAppointment(payload);
            notification.success({
                message: 'Đặt lịch thành công',
                description: `Lịch hẹn với bác sĩ ${doctorName} đã được tạo.`,
                icon: <FaCheckCircle style={{ color: '#52c41a' }} />,
            });
            onSuccess();
        } catch (error: any) {
            notification.error({
                message: 'Đặt lịch thất bại',
                description: error.message || 'Lỗi khi tạo lịch hẹn',
                icon: <FaExclamationTriangle style={{ color: '#faad14' }} />,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 mx-auto">
            <Title level={3} className="!mb-6 text-center">4. Xác nhận Đặt lịch với Bác sĩ</Title>

            <Card title="Thông tin Lịch hẹn" className="mb-6">
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Bác sĩ" labelStyle={{ fontWeight: 'bold' }}>{doctorName}</Descriptions.Item>
                    <Descriptions.Item label="Ngày khám" labelStyle={{ fontWeight: 'bold' }}>{dayjs(dateTime.date).format('dddd, DD/MM/YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="Khung giờ" labelStyle={{ fontWeight: 'bold' }}>{dateTime.timeSlot}</Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Thông tin Hồ sơ Sức khỏe" className="mb-6 bg-blue-50">
                <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Tên Bệnh nhân" labelStyle={{ fontWeight: 'bold' }}>{profile.name}</Descriptions.Item>
                    <Descriptions.Item label="Ngày sinh" labelStyle={{ fontWeight: 'bold' }}>{dayjs(profile.dob).format('DD/MM/YYYY')}</Descriptions.Item>
                    <Descriptions.Item label="SĐT" labelStyle={{ fontWeight: 'bold' }}>{profile.phone}</Descriptions.Item>
                    <Descriptions.Item label="email" labelStyle={{ fontWeight: 'bold' }}>{user?.email || 'Chưa có'}</Descriptions.Item>
                </Descriptions>
            </Card>

            <div className="mb-6 mt-4">
                <Title level={5} className="!mb-2">Lý do khám bệnh <Text type="danger">*</Text></Title>
                <TextArea rows={4} placeholder="Mô tả lý do" value={reason} onChange={(e) => setReason(e.target.value)} disabled={loading} />
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
                <Button onClick={onBack} icon={<FaArrowLeft />} disabled={loading}>Quay lại</Button>
                <Button type="primary" size="large" onClick={handleSubmit} loading={loading} icon={loading ? <Spin size="small" /> : <FaCheckCircle />} disabled={!reason || reason.trim().length < 1}>Xác nhận Đặt lịch</Button>
            </div>
        </div>
    );
};

export default ConfirmAppointmentDoctor;
