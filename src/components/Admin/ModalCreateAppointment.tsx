import React, { useState } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { createAppointment, type CreateAppointmentDto, type Appointment } from '../../services/AppointmentService';

interface ModalCreateAppointmentProps {
    open: boolean;
    onClose: () => void;
    onCreated?: (created: Appointment) => void;
}

const ModalCreateAppointment: React.FC<ModalCreateAppointmentProps> = ({ open, onClose, onCreated }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            const payload: CreateAppointmentDto = {
                patientName: values.patientName,
                doctorName: values.doctorName,
                appointmentDate: values.appointmentDate,
                time_slot: values.time_slot,
                reason: values.reason,
                status: values.status,
            } as CreateAppointmentDto;
            const created = await createAppointment(payload);
            message.success('Tạo lịch hẹn thành công');
            form.resetFields();
            onCreated?.(created);
            onClose();
        } catch (err: any) {
            if (err?.errorFields) return; // validation error
            message.error('Tạo lịch hẹn thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Thêm lịch hẹn mới"
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            confirmLoading={loading}
            okText="Tạo"
            cancelText="Hủy"
            destroyOnHidden={true}
        >
            <Form form={form} layout="vertical" preserve={false}>
                <Form.Item name="patientName" label="Tên bệnh nhân"
                    rules={[{ required: true, message: 'Vui lòng nhập tên bệnh nhân' }]}>
                    <Input placeholder="Nhập tên bệnh nhân" />
                </Form.Item>
                <Form.Item name="doctorName" label="Bác sĩ" rules={[{ required: true, message: 'Vui lòng nhập bác sĩ' }]}>
                    <Input placeholder="Nhập tên bác sĩ" />
                </Form.Item>
                <Form.Item name="appointmentDate" label="Ngày giờ" rules={[{ required: true, message: 'Vui lòng nhập ngày giờ' }]}>
                    <Input type="datetime-local" />
                </Form.Item>
                <Form.Item name="reason" label="Lý do">
                    <Input.TextArea placeholder="Ghi chú/ lý do" rows={3} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ModalCreateAppointment;
