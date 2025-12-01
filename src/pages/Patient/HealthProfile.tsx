import React, { useEffect, useState } from 'react';
import {
    Button, List, Tag, Drawer, Form, Input, Select, Space, message,
    Empty, Card, DatePicker, Row, Col, Descriptions, Popconfirm
} from 'antd';
import { FaUser } from 'react-icons/fa';
import { EditOutlined, DeleteOutlined, CalendarOutlined, MedicineBoxOutlined, HeartOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import * as HealthProfileService from '../../services/HealthProfileService';
import * as FamilyMemberService from '../../services/FamilyMemberService';
import type { HealthProfile } from '../../services/HealthProfileService';
import { getPatientByAccountId } from "../../services/PatientService";
const { Option } = Select;

// ✨ Card hiển thị hồ sơ với nút xóa
const CardHoverProfile: React.FC<{
    profile: HealthProfile;
    onEdit: () => void;
    onDelete: () => void;
}> = ({ profile, onEdit, onDelete }) => {
    const title = profile.type === 'Patient'
        ? 'Chủ sở hữu'
        : profile.familyMemberName || 'Thành viên';

    return (
        <Card
            hoverable
            style={{ borderRadius: 16, boxShadow: '0 6px 20px rgba(0,0,0,0.08)', minHeight: 220 }}
            title={
                <Space align="center">
                    <FaUser style={{ fontSize: 24, color: '#4f46e5' }} />
                    <span style={{ fontWeight: 'bold', fontSize: 18 }}>{title}</span>
                    {profile.type === 'Patient'
                        ? <Tag color="blue">Bạn</Tag>
                        : <Tag color="purple">{profile.relationship}</Tag>}
                </Space>
            }
            extra={
                <Space>
                    <Button type="text" icon={<EditOutlined />} onClick={onEdit} />
                    {profile.type === 'FamilyMember' && (
                        <Popconfirm
                            title="Bạn có chắc muốn xóa hồ sơ này không?"
                            onConfirm={onDelete}
                            okText="Có"
                            cancelText="Không"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    )}
                </Space>
            }
        >
            <Descriptions column={1} size="small" bordered style={{ borderRadius: 8, overflow: 'hidden' }}>
                <Descriptions.Item
                    label={<Space><CalendarOutlined /> Chiều cao</Space>}
                    styles={{ label: { width: '40%' } }}
                >
                    {profile.height ?? '-'} cm
                </Descriptions.Item>
                <Descriptions.Item
                    label={<Space><CalendarOutlined /> Cân nặng</Space>}
                    styles={{ label: { width: '40%' } }}
                >
                    {profile.weight ?? '-'} kg
                </Descriptions.Item>
                <Descriptions.Item
                    label={<Space><HeartOutlined /> Nhóm máu</Space>}
                    styles={{ label: { width: '40%' } }}
                >
                    {profile.bloodType ?? '---'}
                </Descriptions.Item>
                <Descriptions.Item
                    label={<Space><MedicineBoxOutlined /> Dị ứng</Space>}
                    styles={{ label: { width: '40%' } }}
                >
                    {(profile.allergies || []).slice(0, 3).join(', ') || '---'}
                </Descriptions.Item>
                <Descriptions.Item
                    label={<Space><MedicineBoxOutlined /> Thuốc đang dùng</Space>}
                    styles={{ label: { width: '40%' } }}
                >
                    {(profile.medications || []).slice(0, 3).join(', ') || '---'}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

const HealthProfilePage: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [profiles, setProfiles] = useState<HealthProfile[]>([]);
    const [selected, setSelected] = useState<HealthProfile | null>(null);
    const [patientId, setPatientId] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [formType, setFormType] = useState<'Patient' | 'FamilyMember'>('Patient');

    const [form] = Form.useForm();

    // Load patient + health profiles
    const load = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const patient = await getPatientByAccountId(user.id);
            if (!patient) {
                message.error("Không tìm thấy thông tin bệnh nhân");
                setProfiles([]);
                setPatientId(null);
                return;
            }
            setPatientId(patient?._id || null);

            const data = await HealthProfileService.getAllHealthProfiles(patient?._id || '');
            const profilesArray = Array.isArray(data) ? data : [];
            setProfiles(profilesArray);
        } catch (err) {
            console.error(err);
            message.error("Không thể tải hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [user]);

    const openNew = (type: 'Patient' | 'FamilyMember' = 'Patient') => {
        setSelected(null);
        form.resetFields();
        setFormType(type);
        setDrawerOpen(true);
    };

    const openEdit = (p: HealthProfile) => {
        setSelected(p);
        setFormType(p.type);
        form.setFieldsValue({
            familyMemberName: p.familyMemberName,
            relationship: p.relationship,
            height: p.height,
            weight: p.weight,
            bloodType: p.bloodType,
            allergies: (p.allergies || []).join(", "),
            chronicConditions: (p.chronicConditions || []).join(", "),
            medications: (p.medications || []).join(", "),
            emergencyContactName: p.emergencyContact?.name,
            emergencyContactPhone: p.emergencyContact?.phone,
        });
        setDrawerOpen(true);
    };

    const onDelete = async (profile: HealthProfile) => {
        try {
            setLoading(true);
            if (profile.type === 'FamilyMember') {
                await FamilyMemberService.deleteFamilyMember(profile.ownerId);
            }
            await HealthProfileService.deleteHealthProfileById(profile._id);
            message.success('Xóa hồ sơ thành công');
            load();
        } catch (err: any) {
            console.error(err);
            message.error(err?.message || 'Lỗi khi xóa hồ sơ');
        } finally {
            setLoading(false);
        }
    };

    const onSave = async () => {
        if (!patientId) return;
        try {
            const values = await form.validateFields();
            setLoading(true);

            let ownerId = patientId;

            if (formType === 'FamilyMember' && !selected) {
                const fm = await FamilyMemberService.createFamilyMember({
                    bookerId: patientId,
                    name: values.familyMemberName,
                    relationship: values.relationship,
                    dob: values.dob?.toISOString(),
                    phone: values.familyMemberPhone
                });
                ownerId = fm._id || '';
            }

            const healthPayload: any = {
                height: values.height ? Number(values.height) : undefined,
                weight: values.weight ? Number(values.weight) : undefined,
                bloodType: values.bloodType || undefined,
                allergies: values.allergies ? values.allergies.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined,
                chronicConditions: values.chronicConditions ? values.chronicConditions.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined,
                medications: values.medications ? values.medications.split(',').map((s: string) => s.trim()).filter(Boolean) : undefined,
                emergencyContact: (values.emergencyContactName || values.emergencyContactPhone) ? {
                    name: values.emergencyContactName || undefined,
                    phone: values.emergencyContactPhone || undefined
                } : undefined
            };
            Object.keys(healthPayload).forEach(key => {
                if (healthPayload[key] === undefined) delete healthPayload[key];
            });

            if (selected) {
                // Update existing
                if (formType === "FamilyMember") {
                    await FamilyMemberService.updateFamilyMember(selected.ownerId, {
                        relationship: values.relationship,
                        name: values.familyMemberName,
                        dob: values.dob?.toISOString(),
                        phone: values.familyMemberPhone
                    });
                }
                await HealthProfileService.updateHealthProfileById(selected._id, healthPayload);
                message.success("Cập nhật hồ sơ thành công");
            } else {
                // Create new
                try {
                    await HealthProfileService.createHealthProfileNew(formType, ownerId, healthPayload);
                    message.success("Tạo hồ sơ thành công");
                } catch (createError: any) {
                    if (createError?.response?.data?.message?.includes('already exists') && formType === 'Patient') {
                        // Patient HP exists → update
                        const existingProfiles = await HealthProfileService.getAllHealthProfiles(patientId);
                        const existingProfile = existingProfiles.find((p: any) => p.type === 'Patient');
                        if (existingProfile) {
                            await HealthProfileService.updateHealthProfileById(existingProfile._id, healthPayload);
                            message.success("Cập nhật hồ sơ chủ sở hữu thành công");
                        } else {
                            throw createError;
                        }
                    } else {
                        throw createError;
                    }
                }
            }

            setDrawerOpen(false);
            load();

        } catch (err: any) {
            console.error("Error saving profile:", err);
            const errorMsg = err?.response?.data?.message || err?.message || "Lỗi khi lưu hồ sơ";
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const owner = profiles.find(p => p.type === "Patient") ?? null;
    const family = profiles.filter(p => p.type === "FamilyMember");

    return (
        <div style={{ padding: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} size={24}>
                <Space style={{ justifyContent: "space-between", width: '100%' }}>
                    <h2 className="text-2xl font-bold">Hồ sơ sức khỏe</h2>
                    <Space>
                        {!owner && <Button type="primary" onClick={() => openNew('Patient')}>Thêm hồ sơ chủ sở hữu</Button>}
                        <Button type="primary" onClick={() => openNew('FamilyMember')}>Thêm hồ sơ thành viên</Button>
                    </Space>
                </Space>

                <div>
                    <h3 className="text-xl font-semibold mb-4">Chủ sở hữu</h3>
                    {owner ? (
                        <List grid={{ gutter: 16, column: 1 }}>
                            <List.Item>
                                <CardHoverProfile
                                    profile={owner}
                                    onEdit={() => openEdit(owner)}
                                    onDelete={() => onDelete(owner)}
                                />
                            </List.Item>
                        </List>
                    ) : <Empty description="Chưa có hồ sơ chủ" />}
                </div>

                <div>
                    <h3 className="text-xl font-semibold mt-8 mb-4">Thành viên gia đình</h3>
                    {family.length ? (
                        <List
                            grid={{ gutter: 16, column: 3, xs: 1, sm: 2, md: 3, lg: 3 }}
                            dataSource={family}
                            renderItem={item => (
                                <List.Item>
                                    <CardHoverProfile
                                        profile={item}
                                        onEdit={() => openEdit(item)}
                                        onDelete={() => onDelete(item)}
                                    />
                                </List.Item>
                            )}
                        />
                    ) : <Empty description="Chưa có hồ sơ thành viên" />}
                </div>
            </Space>

            <Drawer
                title={selected ? "Chỉnh sửa hồ sơ" : "Tạo hồ sơ mới"}
                width={550}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                bodyStyle={{ paddingBottom: 24 }}
                footer={
                    <div style={{ textAlign: "right" }}>
                        <Button onClick={() => setDrawerOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
                        <Button type="primary" onClick={onSave} loading={loading}>Lưu</Button>
                    </div>
                }
            >
                <Form layout="vertical" form={form} colon={false}>
                    {!selected && (
                        <Form.Item label="Loại hồ sơ">
                            <Select value={formType} onChange={setFormType}>
                                <Option value="FamilyMember">Thành viên gia đình</Option>
                                <Option value="Patient">Chủ sở hữu</Option>
                            </Select>
                        </Form.Item>
                    )}

                    {formType === "FamilyMember" && (
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                            <Form.Item
                                name="familyMemberName"
                                label="Tên thành viên"
                                rules={[{ required: true, message: "Nhập tên thành viên" }]}
                            >
                                <Input placeholder="Nhập tên thành viên" />
                            </Form.Item>

                            <Form.Item
                                name="relationship"
                                label="Quan hệ"
                                rules={[{ required: true, message: "Chọn quan hệ" }]}
                            >
                                <Select placeholder="Chọn quan hệ">
                                    <Option value="Bố">Bố</Option>
                                    <Option value="Mẹ">Mẹ</Option>
                                    <Option value="Vợ/Chồng">Vợ / Chồng</Option>
                                    <Option value="Con">Con</Option>
                                    <Option value="Anh/Chị/Em">Anh / Chị / Em</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item name="dob" label="Ngày sinh">
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item name="familyMemberPhone" label="SĐT">
                                <Input placeholder="Số điện thoại" />
                            </Form.Item>
                        </Space>
                    )}

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="height" label="Chiều cao (cm)">
                                <Input type="number" placeholder="Ví dụ: 170" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="weight" label="Cân nặng (kg)">
                                <Input type="number" placeholder="Ví dụ: 60" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="bloodType" label="Nhóm máu">
                        <Select allowClear placeholder="Chọn nhóm máu">
                            <Option value="A">A</Option>
                            <Option value="B">B</Option>
                            <Option value="AB">AB</Option>
                            <Option value="O">O</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="allergies" label="Dị ứng (cách nhau bởi dấu ,)">
                        <Input placeholder="Ví dụ: Penicillin, Dust" />
                    </Form.Item>

                    <Form.Item name="chronicConditions" label="Bệnh mãn tính (cách nhau bởi dấu ,)">
                        <Input placeholder="Ví dụ: Tiểu đường, Huyết áp" />
                    </Form.Item>

                    <Form.Item name="medications" label="Thuốc đang dùng (cách nhau bởi dấu ,)">
                        <Input placeholder="Ví dụ: Paracetamol" />
                    </Form.Item>

                    <Form.Item label="Liên hệ khẩn cấp">
                        <Input.Group compact>
                            <Form.Item name="emergencyContactName" noStyle>
                                <Input style={{ width: "50%" }} placeholder="Tên" />
                            </Form.Item>
                            <Form.Item name="emergencyContactPhone" noStyle>
                                <Input style={{ width: "50%" }} placeholder="SĐT" />
                            </Form.Item>
                        </Input.Group>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    );
};

export default HealthProfilePage;
