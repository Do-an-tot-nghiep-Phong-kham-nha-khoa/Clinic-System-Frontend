import { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, message, DatePicker } from 'antd';
import moment from 'moment';

import { updateDoctor } from '../../services/DoctorService';
import { updatePatient } from '../../services/PatientService';
import { updateAdmin } from '../../services/AdminService';
import { updateReceptionist } from '../../services/ReceptionistService';

const { Option } = Select;

type Props = {
  open: boolean;
  onClose: () => void;
  onUpdated?: () => void;
  account: any; 
};

const ModalEditAccount = ({ open, onClose, onUpdated, account }: Props) => {
  const [form] = Form.useForm();
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    if (account) {
      const detectedRole = account.roleId?.name || '';
      setRole(detectedRole);

      form.setFieldsValue({
        name: account.name,
        phone: account.phone,
        email: account.email,
        specialtyId: account.specialtyId,
        experience: account.experience,
        address: account.address,
        gender: account.gender,
        avatar: account.avatar,
        note: account.note,
        dob: account.dob ? moment(account.dob) : undefined
      });
    }
  }, [account]);

  const handleSubmit = async (values: any) => {
    if (!account?._id) {
      message.error("Missing account id");
      return;
    }

    try {
      switch (role) {
        case 'doctor':
          await updateDoctor(account._id, {
            name: values.name,
            phone: values.phone,
            specialtyId: values.specialtyId,
            experience: values.experience
          });
          break;

        case 'patient':
          await updatePatient(account._id, {
            name: values.name,
            phone: values.phone,
            dob: values.dob?.format('YYYY-MM-DD'),
            address: values.address,
            gender: values.gender
          });
          break;

        case 'admin':
          await updateAdmin(account._id, {
            name: values.name,
            phone: values.phone,
            avatar: values.avatar,
            note: values.note
          });
          break;

        case 'receptionist':
          await updateReceptionist(account._id, {
            name: values.name,
            phone: values.phone
          });
          break;

        default:
          message.error("Role không hợp lệ");
          return;
      }

      message.success("Cập nhật thành công");
      onUpdated?.();
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message || "Lỗi cập nhật");
    }
  };

  return (
    <Modal
      title="Chỉnh sửa tài khoản"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>

        <Form.Item label="Vai trò">
          <Input value={role} disabled />
        </Form.Item>

        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Email">
          <Input value={account?.email} disabled />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
        >
          <Input />
        </Form.Item>

        {role === 'doctor' && (
          <>
            <Form.Item
              label="Chuyên khoa ID"
              name="specialtyId"
              rules={[{ required: true, message: 'Vui lòng nhập specialtyId' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Kinh nghiệm (năm)" name="experience">
              <Input />
            </Form.Item>
          </>
        )}

        {role === 'patient' && (
          <>
            <Form.Item label="Ngày sinh" name="dob">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="Địa chỉ" name="address">
              <Input />
            </Form.Item>

            <Form.Item label="Giới tính" name="gender">
              <Select>
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="other">Khác</Option>
              </Select>
            </Form.Item>
          </>
        )}

        {role === 'admin' && (
          <>
            <Form.Item label="Avatar URL" name="avatar">
              <Input />
            </Form.Item>

            <Form.Item label="Ghi chú" name="note">
              <Input />
            </Form.Item>
          </>
        )}

        {role === 'receptionist' && null}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalEditAccount;
