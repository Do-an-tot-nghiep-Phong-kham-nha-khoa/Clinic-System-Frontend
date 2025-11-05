import { Button, Card, Typography } from 'antd';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
const { Title, Text } = Typography;

type Props = {
    appointmentInfo: { doctorName: string; date: string; timeSlot: string; patientName: string };
};

const SuccessScreenDoctor: React.FC<Props> = ({ appointmentInfo }) => {
    return (
        <div className="p-4 text-center">
            <Card className="max-w-lg mx-auto">
                <div className="flex flex-col items-center gap-4">
                    <FaCheckCircle style={{ color: '#52c41a', fontSize: 48 }} />
                    <Title level={3}>Đặt lịch Hẹn Thành Công</Title>
                    <Text>Thời gian: {appointmentInfo.date} - {appointmentInfo.timeSlot}</Text>
                    <Text>Bác sĩ: <strong>{appointmentInfo.doctorName}</strong></Text>
                    <Text>Bệnh nhân: {appointmentInfo.patientName}</Text>
                    <div className="mt-4">
                        <Button type="primary" onClick={() => window.location.href = '/patient'}>Về trang bệnh nhân</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default SuccessScreenDoctor;
