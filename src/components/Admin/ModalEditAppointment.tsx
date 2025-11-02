import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import * as AppointmentService from '../../services/AppointmentService';
import type { Appointment } from '../../services/AppointmentService';

interface ModalEditAppointmentProps {
    open: boolean;
    id?: string;
    onClose: () => void;
    onUpdated?: (updated: Appointment) => void;
}

const ModalEditAppointment: React.FC<ModalEditAppointmentProps> = ({ open, id, onClose, onUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchDetail = async () => {
            if (!open || !id) return;
                try {
                setLoading(true);
                const data = await (AppointmentService as any).getAppointment(id);
                form.setFieldsValue({
                    patientName: data.patientName ?? data.profile,
                    doctorName: data.doctorName ?? data.doctor_id,
                    appointmentDate: data.appointmentDate ?? data.appointment_date,
                    reason: data.reason ?? data.notes,
                    status: data.status,
                });
            } catch (e) {
                message.error('Không thể tải dữ liệu lịch hẹn');
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
                patientName: values.patientName,
                doctorName: values.doctorName,
                appointmentDate: values.appointmentDate,
                reason: values.reason,
                status: values.status,
            };
            const updated = await (AppointmentService as any).updateAppointment(id, payload);
            message.success('Cập nhật lịch hẹn thành công');
            onUpdated?.(updated);
            onClose();
        } catch (err: any) {
            if (err?.errorFields) return; // validation error
            message.error('Cập nhật lịch hẹn thất bại');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal
            title="Chỉnh sửa lịch hẹn"
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
                <Form.Item name="patientName" label="Tên bệnh nhân"
                    rules={[{ required: true, message: 'Vui lòng nhập tên bệnh nhân' }]}>
                    <Input placeholder="Tên bệnh nhân" />
                </Form.Item>
                <Form.Item name="doctorName" label="Bác sĩ"
                    rules={[{ required: true, message: 'Vui lòng nhập bác sĩ' }]}>
                    <Input placeholder="Bác sĩ" />
                </Form.Item>
                <Form.Item name="appointmentDate" label="Ngày giờ"
                    rules={[{ required: true, message: 'Vui lòng nhập ngày giờ' }]}>
                    <Input type="datetime-local" />
                </Form.Item>
                <Form.Item name="reason" label="Lý do">
                    <Input.TextArea placeholder="Ghi chú/ lý do" rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalEditAppointment;
