import React, { useState, useEffect } from 'react';
import { Card, Spin, Skeleton, Alert, Tag, Descriptions, Empty, Avatar } from 'antd';
import { UserOutlined, PhoneOutlined, IdcardOutlined, RocketOutlined, ExperimentOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { getDoctorById, type Doctor } from "../../services/DoctorService";

const DoctorProfileView: React.FC = () => {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Lấy doctorId từ URL
    const { doctorId } = useParams<{ doctorId: string }>();

    const fetchDoctorData = async () => {
        if (!doctorId) {
            setError("Không tìm thấy Doctor ID để tải hồ sơ.");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getDoctorById(doctorId);
            setDoctor(data);
            console.log(data)
            setError(null);
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu bác sĩ:", err);
            setError("Không thể tải thông tin hồ sơ bác sĩ. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctorData();
    }, [doctorId]);

    if (loading) {
        return (
            <div className="p-4 sm:p-8 flex justify-center bg-gray-50 min-h-screen">
                <Card className="w-full max-w-4xl shadow-xl rounded-2xl">
                    <Skeleton active avatar paragraph={{ rows: 5 }} />
                    <div className="mt-4 text-center">
                        <Spin size="large" />
                        <p className="mt-2 text-gray-500">Đang tải hồ sơ chuyên gia...</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-8 flex justify-center bg-gray-50 min-h-screen">
                <Alert
                    message="Lỗi Tải Dữ Liệu"
                    description={error}
                    type="error"
                    showIcon
                    className="w-full max-w-4xl"
                />
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="p-4 sm:p-8 flex justify-center bg-gray-50 min-h-screen">
                <Card className="w-full max-w-4xl shadow-xl rounded-2xl">
                    <Empty
                        description={<span>Không tìm thấy hồ sơ bác sĩ nào.</span>}
                    />
                </Card>
            </div>
        );
    }

    const specialtyName = doctor.specialtyId?.name || 'Chưa xác định';
    const specialtyId = doctor.specialtyId?._id || 'N/A';
    const experience = doctor.experience;
    const phone = doctor.phone || 'N/A';

    return (
        <div className="p-4 sm:p-8">
            <div className="container mx-auto">
                <Card
                    className="shadow-2xl rounded-2xl border-t-4 border-cyan-600"
                    title={
                        <div className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
                            <ExperimentOutlined className="text-cyan-600" />
                            <span>Hồ Sơ Bác Sĩ</span>
                        </div>
                    }
                >
                    <div className="flex flex-col md:flex-row items-start md:items-center mb-6 border-b pb-4">
                        <Avatar
                            size={96}
                            icon={<UserOutlined />}
                            className="bg-cyan-100 text-cyan-600 text-5xl font-bold shadow-lg mr-6 flex-shrink-0"
                        >
                            {doctor.name.charAt(0)}
                        </Avatar>

                        <div className="mt-4 md:mt-0 mx-4">
                            <h3 className="text-3xl font-extrabold text-gray-900 leading-tight">{doctor.name}</h3>
                            <div className="mt-1 space-x-2">
                                <Tag color="processing" icon={<ExperimentOutlined />} className="text-base px-3 py-1 font-semibold">
                                    {specialtyName}
                                </Tag>
                            </div>
                        </div>
                    </div>

                    <h4 className="text-xl font-semibold text-gray-700 mb-3 border-l-4 border-indigo-500 pl-2">Thông Tin Chuyên Môn & Liên Hệ</h4>

                    <Descriptions
                        column={1}
                        bordered
                        layout="horizontal"
                        className="rounded-lg overflow-hidden"
                        size="middle"
                    >
                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><RocketOutlined className="mr-2" /> Kinh Nghiệm</span>}
                        >
                            <span className="font-bold text-indigo-600">{experience} năm</span>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><PhoneOutlined className="mr-2" /> Số Điện Thoại</span>}
                        >
                            <span className="font-semibold text-green-600">{phone}</span>
                        </Descriptions.Item>

                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><IdcardOutlined className="mr-2" /> Mã Bác Sĩ</span>}
                        >
                            <Tag color="magenta">{doctor._id}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><EnvironmentOutlined className="mr-2" /> Mã Chuyên Khoa</span>}
                        >
                            {specialtyId}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><ExperimentOutlined className="mr-2" /> Tên Chuyên Khoa</span>}
                        >
                            {specialtyName}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </div>
    );
};

export default DoctorProfileView;
