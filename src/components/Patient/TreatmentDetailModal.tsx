import { useEffect, useState } from "react";
import { Modal, Descriptions, Table, Spin, Empty, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { getTreatmentById } from "../../services/TreatmentService";
import type {
    Treatment as TreatmentType,
    LabOrder,
    Prescription,
} from "../../services/TreatmentService";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const { Text, Title } = Typography;

type Props = {
    visible: boolean;
    treatmentId?: string | null;
    onClose: () => void;
};

const formatCurrency = (value?: number) => {
    if (typeof value !== "number") return "—";
    return `${value.toLocaleString("vi-VN")} VND`;
};

const TreatmentDetailModal: React.FC<Props> = ({ visible, treatmentId, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [treatment, setTreatment] = useState<TreatmentType | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!visible) return;
        if (!treatmentId) {
            setTreatment(null);
            setError("Treatment ID is missing");
            return;
        }

        let mounted = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getTreatmentById(treatmentId);
                if (!mounted) return;
                setTreatment(data);
            } catch (err: any) {
                console.error("Load treatment error", err);
                if (!mounted) return;
                setError(err?.message || "Không tải được chi tiết ca khám");
                setTreatment(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [visible, treatmentId]);

    const labColumns: ColumnsType<LabOrder["items"][number]> = [
        {
            title: "Dịch vụ",
            dataIndex: ["serviceId", "name"],
            key: "serviceName",
            render: (_, rec) => rec.serviceId?.name || "—",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            width: 100,
            align: "right",
        },
        {
            title: "Mô tả",
            dataIndex: "description",
            key: "description",
            ellipsis: true,
        },
        {
            title: "Đơn giá",
            dataIndex: ["serviceId", "price"],
            key: "price",
            align: "right",
            width: 150,
            render: (text) => formatCurrency(text),
        }
    ];

    const medicineColumns: ColumnsType<Prescription["items"][number]> = [
        {
            title: "Thuốc",
            dataIndex: ["medicineId", "name"],
            key: "name",
            render: (_, rec) => rec.medicineId?.name || "—",
            fixed: "left",
            width: 200,
        },
        {
            title: "Nhà sản xuất",
            dataIndex: ["medicineId", "manufacturer"],
            key: "manufacturer",
            render: (_, rec) => rec.medicineId?.manufacturer || "—",
            width: 180,
        },
        {
            title: "Đơn vị",
            dataIndex: ["medicineId", "unit"],
            key: "unit",
            render: (_, rec) => rec.medicineId?.unit || "—",
            width: 100,
            align: "center",
        },
        {
            title: "Hạn dùng",
            dataIndex: ["medicineId", "expiryDate"],
            key: "expiryDate",
            render: (text) => (text ? dayjs(text).format("DD/MM/YYYY") : "—"),
            width: 130,
            align: "center",
        },
        {
            title: "Số lượng",
            dataIndex: "quantity",
            key: "quantity",
            width: 100,
            align: "right",
        },
        {
            title: "Liều dùng",
            dataIndex: "dosage",
            key: "dosage",
            width: 120,
        },
        {
            title: "Tần suất",
            dataIndex: "frequency",
            key: "frequency",
            width: 120,
        },
        {
            title: "Thời lượng",
            dataIndex: "duration",
            key: "duration",
            width: 120,
        },
        {
            title: "Hướng dẫn",
            dataIndex: "instruction",
            key: "instruction",
            ellipsis: true,
            width: 200,
        },
        {
            title: "Đơn giá",
            dataIndex: ["medicineId", "price"],
            key: "price",
            render: (text) => formatCurrency(text),
            fixed: "right",
            width: 130,
            align: "right",
        }
    ];

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
                    <Spin size="large" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
                    <Text type="danger">{error}</Text>
                </div>
            );
        }

        if (!treatment) {
            return (
                <div className="flex justify-center items-center" style={{ minHeight: "300px" }}>
                    <Empty description="Không có dữ liệu ca khám" />
                </div>
            );
        }

        return (
            <div className="space-y-8">
                <div>

                    <Title level={5}>Thông tin bệnh nhân & buổi khám</Title>

                    <Descriptions bordered column={2} size="small">

                        <Descriptions.Item label="Tên bệnh nhân">
                            {treatment.healthProfile?.owner_detail?.name || "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày sinh">
                            {treatment.healthProfile?.owner_detail?.dob
                                ? dayjs.utc(treatment.healthProfile.owner_detail.dob).format("DD/MM/YYYY")
                                : "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Số điện thoại">
                            {treatment.healthProfile?.owner_detail?.phone || "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Quan hệ (ownerModel)">

                            {treatment.healthProfile?.ownerModel || "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Bác sĩ">
                            {treatment.doctor?.name || "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Chuyên khoa">
                            {treatment.doctor?.specialtyId?.name || "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày hẹn">
                            {treatment.appointment?.appointmentDate
                                ? dayjs.utc(treatment.appointment.appointmentDate).format("DD/MM/YYYY")
                                : "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Khung giờ">
                            {treatment.appointment?.timeSlot || "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Ngày khám">
                            {treatment.treatmentDate ? dayjs(treatment.treatmentDate).format("DD/MM/YYYY") : "—"}
                        </Descriptions.Item>

                        <Descriptions.Item label="Tổng chi phí" className="font-semibold text-red-600">
                            {formatCurrency(treatment.totalCost)}
                        </Descriptions.Item>

                    </Descriptions>

                </div>

                <div>
                    <Title level={5}>Chuẩn đoán & chỉ số</Title>
                    <Descriptions bordered column={3} size="small">
                        <Descriptions.Item label="Huyết áp">{treatment.bloodPressure || "—"}</Descriptions.Item>
                        <Descriptions.Item label="Nhịp tim">
                            {treatment.heartRate !== undefined && treatment.heartRate !== null
                                ? `${treatment.heartRate} bpm`
                                : "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Nhiệt độ">
                            {treatment.temperature !== undefined && treatment.temperature !== null
                                ? `${treatment.temperature} °C`
                                : "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Triệu chứng" span={3}>
                            {treatment.symptoms || "—"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Chuẩn đoán" span={3}>
                            {treatment.diagnosis || "—"}
                        </Descriptions.Item>
                    </Descriptions>
                </div>

                <div>
                    <Title level={5}>Chỉ định dịch vụ (Lab Order)</Title>
                    {treatment.laborder ? (
                        <div className="space-y-2">

                            <Table
                                rowKey={(rec) => (rec as any)._id ?? Math.random().toString(36).slice(2)}
                                dataSource={treatment.laborder.items || []}
                                columns={labColumns}
                                pagination={false}
                                size="small"
                                bordered
                            />
                            <h2 className="text-right font-semibold">Tổng  <span>
                                {formatCurrency(treatment.laborder.totalPrice)}
                            </span></h2>
                        </div>
                    ) : (
                        <Empty description="Không có chỉ định dịch vụ" />
                    )}
                </div>

                <div>
                    <Title level={5}>Đơn thuốc (Prescription)</Title>
                    {treatment.prescription ? (
                        <div className="space-y-2">
                            <Table
                                rowKey={(rec) => (rec as any)._id ?? Math.random().toString(36).slice(2)}
                                dataSource={treatment.prescription.items || []}
                                columns={medicineColumns}
                                pagination={false}
                                size="small"
                                bordered
                                scroll={{ x: 1500 }}
                            />
                            <h2 className="text-right font-semibold">
                                Tổng <span>
                                    {formatCurrency(treatment.prescription.totalPrice)}
                                </span></h2>
                        </div>
                    ) : (
                        <Empty description="Không có đơn thuốc" />
                    )}
                </div>
            </div>
        );
    };

    return (
        <Modal
            title={<Title level={4} style={{ margin: 0 }}>Chi tiết ca khám</Title>}
            open={visible}
            onCancel={() => {
                onClose();
                setTreatment(null);
                setError(null);
            }}
            footer={null}
            width={1200}
            style={{ top: 40 }}
            destroyOnHidden={true}
        >
            {renderContent()}
        </Modal>
    );
};

export default TreatmentDetailModal;