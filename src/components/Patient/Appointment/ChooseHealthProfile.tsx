import { Button, Card, Col, Row, Typography, Spin, message, Modal, Form, Input, Select, InputNumber, Space } from 'antd';
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaHeartbeat, FaPhone, FaUser } from 'react-icons/fa';
import dayjs from 'dayjs';
import { useAuth } from '../../../contexts/AuthContext';
import { getPatientByAccountId, type Patient as PatientType } from '../../../services/PatientService';
import { getHealthProfileByPatientId, createHealthProfile } from '../../../services/HealthProfileService';

const { Title, Text } = Typography;

interface ChooseHealthProfileProps {
    specialtyId: string;
    specialtyName: string;
    doctorName?: string;
    date: string;
    timeSlot: string;
    onNext: (profile: any) => void;
    onBack: () => void;
}

const ChooseHealthProfile: React.FC<ChooseHealthProfileProps> = ({ specialtyId, specialtyName, doctorName, date, timeSlot, onNext, onBack }) => {
    const { user } = useAuth();
    // presentation object where _id is healthProfile._id but includes patient info
    type HealthProfileView = {
        _id: string; // healthProfile id
        name: string;
        dob: string;
        phone?: string;
    };

    const [profiles, setProfiles] = useState<HealthProfileView[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState<HealthProfileView | null>(null);
    const [patientInfo, setPatientInfo] = useState<PatientType | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Lấy dữ liệu hồ sơ sức khỏe
    useEffect(() => {
        const accountId = user?.id;

        if (accountId) {
            const fetchProfiles = async () => {
                setLoading(true);
                try {
                    // Lấy patient bằng accountId
                    const patient = await getPatientByAccountId(accountId);
                    if (!patient) {
                        message.warning('Không tìm thấy thông tin bệnh nhân.');
                        setProfiles([]);
                        setPatientInfo(null);
                        return;
                    }
                    setPatientInfo(patient);

                    // Lấy health profile theo patient._id
                    const hp = await getHealthProfileByPatientId(patient._id);

                    if (!hp) {
                        // Không có health profile
                        setProfiles([]);
                        setSelectedProfile(null);
                    } else {
                        // Build view model where _id is healthProfile id but include patient info
                        const view = {
                            _id: hp._id,
                            name: (patient as PatientType).name,
                            dob: (patient as PatientType).dob,
                            phone: (patient as PatientType).phone,
                        };
                        setProfiles([view]);
                        setSelectedProfile(view);
                    }
                } catch (error) {
                    console.error("Lỗi khi tải hồ sơ sức khỏe:", error);
                    message.error("Không thể tải hồ sơ sức khỏe. Vui lòng thử lại.");
                    setProfiles([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchProfiles();
        } else {
            setLoading(false);
            message.warning("Không tìm thấy Account ID để tải hồ sơ.");
        }
    }, [user?.id]);

    // Xử lý khi nhấn nút Tiếp tục
    const handleNext = () => {
        if (!selectedProfile) {
            message.warning("Vui lòng chọn một hồ sơ sức khỏe để tiếp tục.");
            return;
        }
        onNext(selectedProfile);
    };

    // Render thẻ hồ sơ sức khỏe
    const renderProfileCard = (profile: HealthProfileView) => {
        const isSelected = selectedProfile?._id === profile._id;
        const dobFormatted = dayjs(profile.dob).format('DD/MM/YYYY');
        const age = dayjs().diff(profile.dob, 'year');

        return (
            <Col xs={24} sm={12} lg={8} key={profile._id}>
                <Card
                    hoverable
                    className={`
                        transition-all duration-200 border-2
                        ${isSelected ? 'border-blue-500 shadow-xl' : 'border-gray-200'}
                    `}
                    onClick={() => setSelectedProfile(profile)}
                    title={
                        <div className="flex items-center">
                            <FaUser className="mr-2 text-blue-500" />
                            <Title level={5} className="!mb-0 !text-blue-600 truncate">
                                {profile.name}
                            </Title>
                        </div>
                    }
                >
                    <div className="space-y-2 text-base text-gray-700">
                        <p className="flex items-center">
                            <FaHeartbeat className="mr-2 text-red-500" />
                            Ngày sinh (Tuổi): {dobFormatted} ({age} tuổi)
                        </p>
                        <p className="flex items-center">
                            <FaPhone className="mr-2 text-green-500" />
                            Số điện thoại: {profile.phone}
                        </p>
                    </div>
                </Card>
            </Col>
        );
    };

    // Create profile inline (when none exists)
    const handleCreateProfile = async () => {
        if (!patientInfo) {
            message.error('Không tìm thấy thông tin bệnh nhân để tạo hồ sơ.');
            return;
        }

        try {
            const values = await form.validateFields();
            const payload = {
                height: values.height || undefined,
                weight: values.weight || undefined,
                bloodType: values.bloodType || undefined,
                allergies: values.allergies ? values.allergies.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                chronicConditions: values.chronicConditions ? values.chronicConditions.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                medications: values.medications ? values.medications.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
                emergencyContact: values.emergencyContactName || values.emergencyContactPhone ? {
                    name: values.emergencyContactName || undefined,
                    relationship: values.emergencyContactRelationship || undefined,
                    phone: values.emergencyContactPhone || undefined,
                } : undefined,
            };

            const created = await createHealthProfile(patientInfo._id, payload as any);
            if (created) {
                const view: HealthProfileView = {
                    _id: created._id,
                    name: patientInfo.name || '',
                    dob: patientInfo.dob || '',
                    phone: patientInfo.phone || undefined,
                };
                setProfiles([view]);
                setSelectedProfile(view);
                setCreateModalOpen(false);
                message.success('Tạo hồ sơ sức khỏe thành công.');
                onNext(view);
            } else {
                message.error('Tạo hồ sơ thất bại. Vui lòng thử lại.');
            }
        } catch (err: any) {
            console.error('Error creating health profile', err);
            if (!err?.errorFields) message.error('Có lỗi khi tạo hồ sơ.');
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <Button onClick={onBack} icon={<FaArrowLeft />}>Quay lại</Button>
                <Title level={3} className="!mb-0">3. Chọn Hồ sơ Sức khỏe</Title>
                <div />
            </div>

            <div className="bg-blue-50 p-3 mb-6 rounded-lg border-l-4 border-blue-500 text-base">
                <h1 className='font-bold'>Lịch hẹn đã chọn</h1>
                <p className="">Chuyên khoa: {specialtyName || '---'}</p>
                <p className="">Bác sĩ: {doctorName || '---'}</p>
                <p className="">Ngày & Giờ: {dayjs(date).format('dddd, DD/MM/YYYY')} lúc {timeSlot}</p>
            </div>

            {loading ? (
                <div className="text-center py-10">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-500">Đang tải hồ sơ sức khỏe...</p>
                </div>
            ) : (
                <>
                    {profiles.length > 0 ? (
                        <>
                            <Title level={5}>Chọn hồ sơ cho lần khám này:</Title>
                            <Row gutter={[16, 16]} className="mb-6">
                                {profiles.map(renderProfileCard)}
                            </Row>
                        </>
                    ) : (
                        <div className="text-center py-10 border rounded-lg bg-gray-50">
                            <Text type="warning">Không tìm thấy hồ sơ sức khỏe nào.</Text>
                            <p className="text-sm text-gray-500">Vui lòng tạo hồ sơ mới nếu cần.</p>
                        </div>
                    )}
                </>
            )}

            <div className="mt-8 pt-4 border-t flex justify-end">
                <Button
                    type="primary"
                    size="large"
                    onClick={handleNext}
                    disabled={!selectedProfile || loading}
                >
                    Tiếp tục ({selectedProfile ? selectedProfile.name : 'Chọn Hồ Sơ'})
                </Button>
            </div>
        </div>
    );
}

export default ChooseHealthProfile;