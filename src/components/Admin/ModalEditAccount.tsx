import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { getAccount, updateAccount, type Account } from '../../services/AccountService';

interface ModalEditAccountProps {
    open: boolean;
    id?: string;
    onClose: () => void;
    onUpdated?: (updated: Account) => void;
}

const ModalEditAccount: React.FC<ModalEditAccountProps> = ({ open, id, onClose, onUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchDetail = async () => {
            if (!open || !id) return;
            try {
                setLoading(true);
                const data = await getAccount(id);
                form.setFieldsValue({
                    email: data.email,
                });
            } catch (e) {
                message.error('Không thể tải dữ liệu tài khoản');
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
        if (!open) form.resetFields();
    }, [open, id, form]);

    const handleOk = async () => {
        if (!id) return;
        try {
            const values = await form.validateFields();
            setSaving(true);
            const payload = {
                username: values.username,
                email: values.email,
            };
            const updated = await updateAccount(id, payload);
            message.success('Cập nhật tài khoản thành công');
            onUpdated?.(updated);
            onClose();
        } catch (err: any) {
            if (err?.errorFields) return; // validation error
            message.error('Cập nhật tài khoản thất bại');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa tài khoản"
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            confirmLoading={saving}
            okText="Lưu"
            cancelText="Hủy"
            destroyOnHidden={true}
            maskClosable={!loading}
        >
            <Form form={form} layout="vertical" preserve={false} disabled={loading}>
                <Form.Item name="username" label="Tên đăng nhập"
                    rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
                    <Input placeholder="Tên đăng nhập" />
                </Form.Item>
                <Form.Item name="email" label="Email"
                    rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
                    <Input placeholder="Email" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEditAccount;
