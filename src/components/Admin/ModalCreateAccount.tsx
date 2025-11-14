import { useState } from 'react';
import { Modal, Form, Input, Select, Button, message, DatePicker } from 'antd';
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

  const handleRoleChange = (value: string) => {
    setRole(value);
    form.resetFields(); // reset các field để tránh dữ liệu cũ
    form.setFieldsValue({ role: value }); // giữ role
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      switch (values.role) {
        case 'doctor':
          await createDoctor({
            email: values.email,
            password: values.password,
            name: values.name,
            specialtyId: values.specialtyId,
            phone: values.phone,
            experience: values.experience,
          });
          break;
        case 'patient':
          await createPatient({
            email: values.email,
            password: values.password,
            name: values.name,
            phone: values.phone,
            dob: values.dob ? values.dob.format('YYYY-MM-DD') : undefined,
            address: values.address,
            gender: values.gender,
          });
          break;
        case 'admin':
          await createAdmin({
            email: values.email,
            password: values.password,
            name: values.name,
            phone: values.phone,
            note: values.note,
            avatar: values.avatar,
          });
          break;
        case 'receptionist':
          await createReceptionist({
            name: values.name,
            phone: values.phone,
            email: values.email,
            password: values.password,
          });
          break;
        default:
          throw new Error('Role không hợp lệ');
      }
      message.success('Tạo tài khoản thành công');
      form.resetFields();
      onCreated?.();
      onClose();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Tạo tài khoản thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Tạo tài khoản mới" open={open} onCancel={onClose} footer={null}>
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

        {(role === 'doctor' || role === 'patient' || role === 'admin'|| role === 'receptionist') && (
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
        )}

        {(role === 'doctor' || role === 'patient' || role === 'admin' || role === 'receptionist') && (
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
              <DatePicker style={{ width: '100%' }} />
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
            <Form.Item label="Avatar URL" name="avatar">
              <Input placeholder="Nhập URL avatar" />
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
