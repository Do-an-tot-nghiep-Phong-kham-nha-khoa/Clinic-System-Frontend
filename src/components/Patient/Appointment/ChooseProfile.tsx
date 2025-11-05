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
    // onNext receives the presentation object which contains _id = healthProfile._id
    onNext: (profile: { _id: string; name: string; dob: string; phone?: string }) => void;
    onBack: () => void;
}

const ChooseHealthProfile: React.FC<ChooseHealthProfileProps> = ({ specialtyId, specialtyName, doctorName, date, timeSlot, onNext, onBack }) => {
    const { user } = useAuth();
    // presentation object where _id is healthProfile._id but includes patient info
    type HealthProfileView = { _id: string; name: string; dob: string; phone?: string };

    const [patientInfo, setPatientInfo] = useState<PatientType | null>(null);
    const [profiles, setProfiles] = useState<HealthProfileView[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProfile, setSelectedProfile] = useState<HealthProfileView | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [form] = Form.useForm();

    // Lấy dữ liệu hồ sơ sức khỏe
    useEffect(() => {
        const accountId = user?.id;

        if (accountId) {
            const fetchProfiles = async () => {
                setLoading(true);
                try {
                    // Lấy patient theo accountId để có patient._id
                    const patient = await getPatientByAccountId(accountId);
                    if (!patient) {
                        setProfiles([]);
                        setSelectedProfile(null);
                        setPatientInfo(null);
                        return;
                    }
                    setPatientInfo(patient);

                    // Lấy health profile thực sự theo patientId (có thể trả về nhiều profiles: patient + family members)
                    const hps = await getHealthProfileByPatientId(patient._id);
                    if (hps && Array.isArray(hps) && hps.length > 0) {
                        const p = patient as PatientType;
                        const views: HealthProfileView[] = hps.map((hp: any) => {
                            // hp.ownerId may be populated with Patient or FamilyMember doc
                            const owner = hp.ownerId && typeof hp.ownerId === 'object' ? hp.ownerId : null;
                            return {
                                _id: hp._id,
                                name: owner?.name ?? p.name ?? '',
                                dob: owner?.dob ? new Date(owner.dob).toISOString() : p.dob ?? '',
                                phone: owner?.phone ?? p.phone ?? undefined,
                            };
                        });
                        setProfiles(views);
                        setSelectedProfile(views[0]);
                    } else {
                        // No health profile found — do not treat patient object as a profile
                        setProfiles([]);
                        setSelectedProfile(null);
                    }
                } catch (error) {
                    console.error("Lỗi khi tải hồ sơ sức khỏe:", error);
                    message.error("Không thể tải hồ sơ sức khỏe. Vui lòng thử lại.");
                    setProfiles([]);
                    setSelectedProfile(null);
                } finally {
                    setLoading(false);
                }
            };

            void fetchProfiles();
        } else {
            setLoading(false);
            message.warning("Không tìm thấy Account ID để tải hồ sơ.");
        }
    }, [user?.id]);

    // Create profile inline
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
                // proceed automatically to next step
                onNext(view);
            } else {
                message.error('Tạo hồ sơ thất bại. Vui lòng thử lại.');
            }
        } catch (err: any) {
            // validation errors handled by form
            console.error('Error creating health profile', err);
            if (!err?.errorFields) message.error('Có lỗi khi tạo hồ sơ.');
        }
    };

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
        const dobFormatted = profile.dob ? dayjs(profile.dob).format('DD/MM/YYYY') : '---';
        const age = profile.dob ? dayjs().diff(profile.dob, 'year') : '---';

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
                            <div className="mt-4">
                                <Space>
                                    <Button type="primary" onClick={() => setCreateModalOpen(true)}>Tạo hồ sơ mới</Button>
                                </Space>
                            </div>
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

            <Modal
                title="Tạo Hồ sơ Sức khỏe mới"
                open={createModalOpen}
                onCancel={() => setCreateModalOpen(false)}
                onOk={handleCreateProfile}
                okText="Tạo & Tiếp tục"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical">
                    <Form.Item label="Chiều cao (cm)" name="height">
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item label="Cân nặng (kg)" name="weight">
                        <InputNumber style={{ width: '100%' }} min={0} />
                    </Form.Item>
                    <Form.Item label="Nhóm máu" name="bloodType">
                        <Select allowClear>
                            <Select.Option value="A">A</Select.Option>
                            <Select.Option value="B">B</Select.Option>
                            <Select.Option value="AB">AB</Select.Option>
                            <Select.Option value="O">O</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Dị ứng (phân tách bằng ,)" name="allergies">
                        <Input placeholder="ví dụ: Penicillin,Phấn hoa" />
                    </Form.Item>
                    <Form.Item label="Tiền sử bệnh (phân tách bằng ,)" name="chronicConditions">
                        <Input placeholder="ví dụ: Tiểu đường, Tăng huyết áp" />
                    </Form.Item>
                    <Form.Item label="Thuốc đang dùng (phân tách bằng ,)" name="medications">
                        <Input placeholder="ví dụ: Paracetamol" />
                    </Form.Item>
                    <Form.Item label="Người liên hệ khẩn cấp - Tên" name="emergencyContactName">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Quan hệ" name="emergencyContactRelationship">
                        <Input />
                    </Form.Item>
                    <Form.Item label="SĐT người liên hệ" name="emergencyContactPhone">
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default ChooseHealthProfile;