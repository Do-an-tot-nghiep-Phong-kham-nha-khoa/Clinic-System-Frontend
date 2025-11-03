import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { registerAccount, type CreateAccountDto, type Account } from '../../services/AccountService';

interface ModalCreateAccountProps {
    open: boolean;
    onClose: () => void;
    onCreated?: (created: Account) => void;
}

const ModalCreateAccount: React.FC<ModalCreateAccountProps> = ({ open, onClose, onCreated }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const payload: CreateAccountDto = {
                email: values.email,
                created_at: new Date().toISOString(),
                password: values.password,
            } as CreateAccountDto;
            const created = await registerAccount(payload);
            message.success('Tạo tài khoản thành công');
            form.resetFields();
            onCreated?.(created);
            onClose();
        } catch (err: any) {
            if (err?.errorFields) return; // validation error
            message.error('Tạo tài khoản thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Thêm tài khoản mới"
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            confirmLoading={loading}
            okText="Tạo"
            cancelText="Hủy"
            destroyOnHidden={true}
        >
            <Form form={form} layout="vertical" preserve={false}>
                <Form.Item name="username" label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
                    <Input placeholder="Nhập tên đăng nhập" />
                </Form.Item>
                <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
                    <Input placeholder="Nhập email" />
                </Form.Item>
                <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                    <Input.Password placeholder="Mật khẩu" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateAccount;
