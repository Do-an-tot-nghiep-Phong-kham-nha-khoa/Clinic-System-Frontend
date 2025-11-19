import { useState } from 'react';
import { Modal, Form, Input, Select, Button, message, DatePicker, Avatar, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { createDoctor } from '../../services/DoctorService';
import { createPatient } from '../../services/PatientService';
import { createAdmin } from '../../services/AdminService';
import { createReceptionist } from '../../services/ReceptionistService';

const { Option } = Select;

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void;
};

const ModalCreateAccount = ({ open, onClose, onCreated }: Props) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<string>('');
  const [previewAvatar, setPreviewAvatar] = useState<string>('');

  const handleRoleChange = (value: string) => {
    setRole(value);
    setPreviewAvatar(''); // Reset preview khi đổi role
    form.resetFields();
    form.setFieldsValue({ role: value });
  };

  // Preview avatar khi chọn file
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('✅ File selected:', file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewAvatar('');
    }
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      const avatarInput = document.querySelector('input[name="avatar"]') as HTMLInputElement;
      const avatarFile = avatarInput?.files?.[0];

      switch (values.role) {
        case 'doctor': {
          const formData = new FormData();
          formData.append('email', values.email);
          formData.append('password', values.password);
          formData.append('name', values.name);
          formData.append('specialtyId', values.specialtyId);
          formData.append('phone', values.phone);
          formData.append('experience', values.experience || '');

          if (avatarFile) {
            formData.append('avatar', avatarFile);
            console.log('📎 Avatar file attached');
          }

          await createDoctor(formData, true);
          message.success('Tạo bác sĩ thành công');
          break;
        }

        case 'patient': {
          const formData = new FormData();
          formData.append('email', values.email);
          formData.append('password', values.password);
          formData.append('name', values.name);
          formData.append('phone', values.phone);
          
          if (values.dob) {
            formData.append('dob', values.dob.format('YYYY-MM-DD'));
          }
          if (values.address) {
            formData.append('address', values.address);
          }
          if (values.gender) {
            formData.append('gender', values.gender);
          }
          if (avatarFile) {
            formData.append('avatar', avatarFile);
            console.log('📎 Avatar file attached');
          }

          await createPatient(formData, true);
          message.success('Tạo bệnh nhân thành công');
          break;
        }

        case 'admin': {
          const formData = new FormData();
          formData.append('email', values.email);
          formData.append('password', values.password);
          formData.append('name', values.name);
          
          if (values.phone) {
            formData.append('phone', values.phone);
          }
          if (values.note) {
            formData.append('note', values.note);
          }
          if (avatarFile) {
            formData.append('avatar', avatarFile);
            console.log('📎 Avatar file attached');
          }

          await createAdmin(formData, true);
          message.success('Tạo admin thành công');
          break;
        }

        case 'receptionist': {
          const formData = new FormData();
          formData.append('email', values.email);
          formData.append('password', values.password);
          formData.append('name', values.name);
          formData.append('phone', values.phone);
          
          if (avatarFile) {
            formData.append('avatar', avatarFile);
            console.log('📎 Avatar file attached');
          }

          await createReceptionist(formData, true);
          message.success('Tạo lễ tân thành công');
          break;
        }

        default:
          throw new Error('Role không hợp lệ');
      }

      form.resetFields();
      setPreviewAvatar('');
      onCreated?.();
      onClose();
    } catch (error: any) {
      console.error('❌ Error:', error);
      message.error(error.response?.data?.message || 'Tạo tài khoản thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      title="Tạo tài khoản mới" 
      open={open} 
      onCancel={onClose} 
      footer={null}
      width={600}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Vai trò"
          name="role"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          initialValue="patient"
        >
          <Select placeholder="Chọn vai trò" onChange={handleRoleChange}>
            <Option value="admin">Admin</Option>
            <Option value="doctor">Bác sĩ</Option>
            <Option value="patient">Bệnh nhân</Option>
            <Option value="receptionist">Lễ tân</Option>
          </Select>
        </Form.Item>

        {/* Common fields */}
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input placeholder="Nhập tên" />
        </Form.Item>

        {(role === 'doctor' || role === 'patient' || role === 'admin' || role === 'receptionist') && (
          <>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input placeholder="Nhập email" />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          </>
        )}

        {/* Avatar Upload - Chung cho tất cả roles */}
        {role && (
          <Form.Item label="Avatar">
            <Space direction="vertical" style={{ width: '100%' }}>
              {/* Preview */}
              {previewAvatar && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
                  <Avatar 
                    size={64} 
                    src={previewAvatar} 
                    icon={<UserOutlined />}
                  />
                  <span style={{ fontSize: 12, color: '#52c41a' }}>
                    ✓ Ảnh đã chọn
                  </span>
                </div>
              )}

              {/* File Input */}
              <input 
                type="file" 
                name="avatar" 
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <span style={{ fontSize: 12, color: '#888' }}>
                Chọn ảnh đại diện (không bắt buộc)
              </span>
            </Space>
          </Form.Item>
        )}

        {role === 'doctor' && (
          <>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              label="Chuyên khoa ID"
              name="specialtyId"
              rules={[{ required: true, message: 'Vui lòng nhập specialtyId' }]}
            >
              <Input placeholder="Nhập specialtyId" />
            </Form.Item>
            <Form.Item label="Kinh nghiệm" name="experience">
              <Input placeholder="Số năm kinh nghiệm" />
            </Form.Item>
          </>
        )}

        {role === 'patient' && (
          <>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item label="Ngày sinh" name="dob">
              <DatePicker style={{ width: '100%' }} placeholder="Chọn ngày sinh" />
            </Form.Item>
            <Form.Item label="Địa chỉ" name="address">
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
            <Form.Item label="Giới tính" name="gender">
              <Select placeholder="Chọn giới tính">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {role === 'admin' && (
          <>
            <Form.Item label="Số điện thoại" name="phone">
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item label="Ghi chú" name="note">
              <Input placeholder="Nhập ghi chú" />
            </Form.Item>
          </>
        )}

        {role === 'receptionist' && (
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Tạo tài khoản
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateAccount;