import React, { useState, useEffect, use } from 'react';
import { Card, Spin, Skeleton, Alert, Tag, Button, Descriptions, Empty, Form, Input, Radio, DatePicker, Modal, message } from 'antd';
import { UserOutlined, PhoneOutlined, CalendarOutlined, IdcardOutlined, EnvironmentOutlined, SaveOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getPatientByAccountId, type Patient, updatePatient, type UpdatePatientDTO } from "../../services/PatientService";
import { useAuth } from '../../contexts/AuthContext';
import { MdEmail } from 'react-icons/md';

// Hàm tính tuổi
const calculateAge = (dob: string): number | null => {
    if (!dob) return null;
    return moment().diff(moment(dob), 'years');
};

interface PatientEditModalProps {
    visible: boolean;
    patient: Patient;
    onClose: () => void;
    onUpdate: (updatedPatient: Patient) => void;
    accountId: string;
}

const PatientEditModal: React.FC<PatientEditModalProps> = ({ visible, patient, onClose, onUpdate, accountId }) => {
    type FormValues = Omit<UpdatePatientDTO, 'dob'> & { dob?: moment.Moment | null };
    const [form] = Form.useForm<FormValues>();
    const [loading, setLoading] = useState(false);

    // Load dữ liệu bệnh nhân vào form khi modal mở
    useEffect(() => {
        if (visible && patient) {
            form.setFieldsValue({
                name: patient.name,
                phone: patient.phone,
                gender: (patient as any).gender || 'other', // Thêm gender giả định nếu API không trả về
                address: (patient as any).address || '',    // Thêm address giả định
                // Chuyển chuỗi ngày ISO sang đối tượng moment cho DatePicker
                dob: patient.dob ? moment(patient.dob) : undefined,
            });
        }
    }, [visible, patient, form]);

    const handleFormSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            // Chuẩn bị DTO: chuyển đổi moment object về chuỗi ngày ISO
            const { dob, ...rest } = values;
            const dataToUpdate: UpdatePatientDTO = {
                ...rest,
                dob: dob ? dob.toISOString() : undefined,
            };

            const updatedPatient = await updatePatient(accountId, dataToUpdate);

            message.success('Cập nhật hồ sơ thành công!');
            onUpdate(updatedPatient); // Gọi callback để component cha làm mới dữ liệu
            onClose();

        } catch (error) {
            message.error('Cập nhật hồ sơ thất bại. Vui lòng thử lại.');
            console.error('Update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Chỉnh Sửa Thông Tin Bệnh Nhân"
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose={true} // Đảm bảo form được reset khi đóng
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFormSubmit}
                initialValues={{ gender: 'other' }}
            >
                <Form.Item
                    name="name"
                    label="Họ và Tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
                >
                    <Input placeholder="Tào A Mân" />
                </Form.Item>

                <Form.Item
                    name="dob"
                    label="Ngày Sinh"
                    rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
                >
                    <DatePicker
                        format="DD/MM/YYYY"
                        placeholder="Chọn ngày"
                        className="w-full"
                    />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Giới Tính"
                    rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
                >
                    <Radio.Group>
                        <Radio value="male">Nam</Radio>
                        <Radio value="female">Nữ</Radio>
                        <Radio value="other">Khác</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="Số Điện Thoại"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                >
                    <Input placeholder="0901234567" />
                </Form.Item>

                <Form.Item
                    name="address"
                    label="Địa Chỉ"
                >
                    <Input.TextArea rows={2} placeholder="Nhập địa chỉ hiện tại..." />
                </Form.Item>


                <Form.Item className="mt-6 mb-0">
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        icon={<SaveOutlined />}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                    >
                        Lưu Thay Đổi
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

const PatientProfile: React.FC = () => {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const currentAccountId = user?.id || '';
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                setLoading(true);
                const data = await getPatientByAccountId(currentAccountId);
                setPatient(data);
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu bệnh nhân:", err);
                setError("Không thể tải thông tin bệnh nhân. Vui lòng thử lại.");
            } finally {
                setLoading(false);
            }
        };

        fetchPatientData();
    }, [currentAccountId]);

    if (loading) {
        return (
            <div className="p-4 sm:p-8 flex justify-center">
                <Card className="w-full max-w-3xl shadow-xl rounded-xl">
                    <Skeleton avatar active paragraph={{ rows: 4 }} />
                    <div className="mt-4 text-center">
                        <Spin size="large" />
                        <p className="mt-2 text-gray-500">Đang tải hồ sơ bệnh nhân...</p>
                    </div>
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 sm:p-8 flex justify-center">
                <Alert
                    message="Lỗi Dữ liệu"
                    description={error}
                    type="error"
                    showIcon
                    className="w-full max-w-3xl"
                />
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="p-4 sm:p-8 flex justify-center">
                <Card className="w-full max-w-3xl shadow-xl rounded-xl">
                    <Empty
                        description={<span>Không tìm thấy hồ sơ bệnh nhân nào.</span>}
                    />
                </Card>
            </div>
        );
    }

    const age = calculateAge(patient.dob);
    const formattedDob = patient.dob ? moment(patient.dob).format('DD/MM/YYYY') : 'N/A';
    const gender = (patient as any).gender || 'N/A';
    const address = (patient as any).address || 'Chưa cập nhật';

    const handlePatientUpdate = (updatedPatient: Patient) => {
        setPatient(updatedPatient);
        // Có thể gọi lại fetchPatientData() nếu cần đảm bảo dữ liệu mới nhất từ server
    };

    return (
        <div className="p-4 sm:p-8 ">
            <div className=" mx-auto">
                <Card
                    className="shadow-2xl rounded-2xl border-t-4 border-indigo-500"
                    title={
                        <div className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
                            <UserOutlined className="text-indigo-600" />
                            <span>Hồ Sơ Bệnh Nhân</span>
                        </div>
                    }
                    extra={
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            className="bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                            onClick={() => setIsEditModalVisible(true)} // Mở Modal
                        >
                            Chỉnh Sửa Hồ Sơ
                        </Button>
                    }
                >
                    {/* Phần Thông tin Cơ bản */}
                    <div className="flex items-center mb-6 border-b pb-4">
                        {/* Ảnh đại diện giả */}
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-3xl font-semibold mr-6 shadow-md">
                            {patient.name.charAt(0)}
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900">{patient.name}</h3>
                            <div className="mt-1 space-x-2">
                                <Tag color="blue" icon={<IdcardOutlined />}>ID Tài Khoản: {patient.accountId}</Tag>
                                {age !== null && (
                                    <Tag color="purple" icon={<CalendarOutlined />}>Tuổi: {age}</Tag>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Phần Chi tiết Liên hệ và Cá nhân */}
                    <h4 className="text-xl font-semibold text-gray-700 mb-3 border-l-4 border-yellow-500 pl-2">Chi Tiết Cá Nhân</h4>
                    <Descriptions
                        column={1}
                        bordered
                        layout="horizontal"
                        className="rounded-lg overflow-hidden"
                    >
                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><CalendarOutlined className="mr-2" /> Ngày Sinh</span>}
                        >
                            <span className="font-semibold text-gray-700">{formattedDob}</span>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><PhoneOutlined className="mr-2" /> Số Điện Thoại</span>}
                        >
                            <span className="font-semibold">{patient.phone}</span>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><MdEmail className="mr-2" /> Email</span>}
                        >
                            <span className="font-semibold">{user?.email}</span>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><IdcardOutlined className="mr-2" /> Mã Bệnh Nhân</span>}
                            span={2}
                        >
                            <Tag color="magenta">{patient._id}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><UserOutlined className="mr-2" /> Giới Tính</span>}
                        >
                            <span className="font-semibold text-gray-700">{gender}</span>
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={<span className="font-medium flex items-center"><EnvironmentOutlined className="mr-2" /> Địa Chỉ</span>}
                            span={2}
                        >
                            {address}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>

            {patient && (
                <PatientEditModal
                    visible={isEditModalVisible}
                    patient={patient}
                    accountId={currentAccountId}
                    onClose={() => setIsEditModalVisible(false)}
                    onUpdate={handlePatientUpdate}
                />
            )}
        </div>
    );
};

export default PatientProfile;