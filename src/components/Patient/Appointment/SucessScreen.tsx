import { Button, Card, Divider, Space, Typography } from 'antd';
import React from 'react';
import { FaCalendarCheck, FaClock, FaMedkit, FaUserTie } from 'react-icons/fa';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

interface AppointmentInfo {
    doctorName?: string;
    specialtyName?: string;
    date: string;
    timeSlot: string;
    patientName: string;
}

interface AppointmentSuccessScreenProps {
    appointmentInfo: AppointmentInfo;
}

const SuccessScreen: React.FC<AppointmentSuccessScreenProps> = ({ appointmentInfo }) => {

    const formattedDate = dayjs(appointmentInfo.date).format('dddd, [ngày] DD/MM/YYYY');

    const handleViewHistory = () => {
        // TODO: Điều hướng đến trang lịch sử đặt lịch
        alert("Chức năng xem lịch sử đang được phát triển!");
    };

    return (
        <div className="text-center p-8 bg-gradient-to-br from-green-50 to-white rounded-xl shadow-2xl mx-auto animate-fadeIn">

            <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full border-4 border-white shadow-lg">
                    <FaCalendarCheck className="text-green-500 text-5xl" />
                </div>
            </div>

            <Title level={2} className="!text-green-600 !font-extrabold !mb-2">
                Đặt Lịch Khám Thành Công! 🎉
            </Title>

            <Paragraph className="text-lg text-gray-700 mb-6">
                Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ lại để xác nhận thông tin chi tiết.
            </Paragraph>

            <Divider orientation="center" className="!my-6">
                <Text strong className="text-blue-600 text-lg">THÔNG TIN CHI TIẾT LỊCH HẸN</Text>
            </Divider>

            <Card className="text-center border-2 border-dashed border-blue-200 bg-white">
                <div className="space-y-3">
                    <p className="flex items-center text-base text-center justify-center">
                        <FaUserTie className="text-blue-500 mr-3" />
                        <Text strong>Bệnh nhân: </Text> {appointmentInfo.patientName}
                    </p>
                    <p className="flex items-center text-base text-center justify-center">
                        <FaUserTie className="text-blue-500 mr-3" />
                        <Text strong>Bác sĩ: </Text> {appointmentInfo.doctorName || '---'}
                    </p>
                    <p className="flex items-center text-base justify-center">
                        <FaMedkit className="text-green-500 mr-3" />
                        <Text strong>Chuyên khoa: </Text> {appointmentInfo.specialtyName || '---'}
                    </p>
                    <p className="flex items-center text-base justify-center">
                        <FaCalendarCheck className="text-red-500 mr-3" />
                        <Text strong>Ngày khám: </Text> {formattedDate}
                    </p>
                    <p className="flex items-center text-base justify-center">
                        <FaClock className="text-orange-500 mr-3" />
                        <Text strong>Thời gian: </Text> {appointmentInfo.timeSlot}
                    </p>
                </div>
            </Card>

            <div className="mt-8 flex justify-center space-x-4">
                <Button
                    size="large"
                    onClick={handleViewHistory}
                    className="border-blue-500 text-blue-500 hover:bg-blue-50"
                >
                    Xem Lịch sử Đặt lịch
                </Button>
                <Button
                    type="primary"
                    size="large"
                    onClick={() => window.location.reload()} // Tải lại trang để bắt đầu quy trình mới
                >
                    Đặt Lịch Khám Mới
                </Button>
            </div>
        </div>
    );
};

export default SuccessScreen;