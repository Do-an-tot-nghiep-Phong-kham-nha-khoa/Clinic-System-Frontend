import { Button, Input, Space, Card, Divider } from "antd";
import { UserOutlined, HeartOutlined, FileTextOutlined, SaveOutlined, ArrowLeftOutlined, ExperimentOutlined, MedicineBoxOutlined } from "@ant-design/icons";
import ButtonPrimary from "../../../utils/ButtonPrimary";

interface PrecheckData {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    symptoms: string;
    diagnosis: string;
}

interface Props {
    appointment: any;
    precheckData: PrecheckData;
    onPrecheckDataChange: (data: PrecheckData) => void;
    isSaving: boolean;
    onBack: () => void;
    onCreateLabOrder: () => void;
    onGotoPrescription: () => void;
    onSaveTreatment: () => void;
}

const PatientPreCheck = ({
    appointment,
    precheckData,
    onPrecheckDataChange,
    isSaving,
    onBack,
    onCreateLabOrder,
    onGotoPrescription,
    onSaveTreatment
}: Props) => {
    const hp = appointment.healthProfile_id;
    const owner = hp?.owner_detail;

    const handleDataChange = (field: keyof PrecheckData, value: string) => {
        onPrecheckDataChange({
            ...precheckData,
            [field]: value,
        });
    };

    return (
        <div className="p-4">
            {/* Thanh điều hướng Quay lại và Tiêu đề */}
            <div className="mb-4 flex justify-between items-center">
                <Button onClick={onBack} icon={<ArrowLeftOutlined />}>
                    Quay lại danh sách
                </Button>
                <div className="text-2xl font-bold">Khám Sơ Bộ Bệnh Nhân</div>
                <div></div> {/* Giữ khoảng trống cho căn chỉnh */}
            </div>

            <Divider />

            {/* Bố cục 2 cột chính */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Cột 1: Thông tin bệnh nhân và Hồ sơ sức khoẻ */}
                <div className="lg:col-span-1 space-y-4">
                    <Card title={<><UserOutlined /> Thông tin Bệnh nhân</>} variant="outlined" className="shadow-md">
                        <div className="space-y-2 text-sm">
                            <div><b>Họ tên:</b> {owner?.name}</div>
                            <div><b>Ngày sinh:</b> {owner?.dob ? new Date(owner.dob).toLocaleDateString() : ""}</div>
                            <div><b>Giới tính:</b> {owner?.gender}</div>
                            <div><b>Số điện thoại:</b> {owner?.phone}</div>
                        </div>
                        <Divider dashed />
                        <div className="text-base font-semibold mb-2">Hồ sơ Sức khoẻ</div>
                        <div className="space-y-2 text-sm">
                            <div><b>Chiều cao:</b> {hp?.height} cm</div>
                            <div><b>Cân nặng:</b> {hp?.weight} kg</div>
                            <div><b>Nhóm máu:</b> {hp?.bloodType || "N/A"}</div>
                            <div className="break-words"><b>Dị ứng:</b> {hp?.allergies?.join(", ") || "Không"}</div>
                            <div className="break-words"><b>Bệnh nền:</b> {hp?.chronicConditions?.join(", ") || "Không"}</div>
                            <div className="break-words"><b>Thuốc đang dùng:</b> {hp?.medications?.join(", ") || "Không"}</div>
                        </div>
                    </Card>
                </div>

                {/* Cột 2: Khám sơ bộ, Triệu chứng, Chẩn đoán */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Khám Sơ Bộ */}
                    <Card title={<><HeartOutlined /> Khám Sơ Bộ</>} variant="outlined" className="shadow-md">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <Input
                                prefix="Huyết áp:"
                                placeholder="Huyết áp (mmHg)"
                                value={precheckData.bloodPressure}
                                onChange={(e) => handleDataChange("bloodPressure", e.target.value)}
                            />
                            <Input
                                prefix="Nhịp tim:"
                                placeholder="Nhịp tim (lần/phút)"
                                value={precheckData.heartRate}
                                onChange={(e) => handleDataChange("heartRate", e.target.value)}
                            />
                            <Input
                                prefix="Nhiệt độ:"
                                placeholder="Nhiệt độ (°C)"
                                value={precheckData.temperature}
                                onChange={(e) => handleDataChange("temperature", e.target.value)}
                            />
                        </div>

                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                            <Input.TextArea
                                placeholder="Triệu chứng lâm sàng (S)"
                                rows={4}
                                value={precheckData.symptoms}
                                onChange={(e) => handleDataChange("symptoms", e.target.value)}
                            />

                            <Input.TextArea
                                placeholder="Chẩn đoán ban đầu (D)"
                                rows={4}
                                value={precheckData.diagnosis}
                                onChange={(e) => handleDataChange("diagnosis", e.target.value)}
                            />
                        </Space>
                    </Card>

                    <div className="mb-4 "></div>
                    <Card variant="outlined" className="shadow-md">
                        <div className="text-base font-semibold mb-3"><FileTextOutlined /> Hành động</div>
                        <Space size="middle" className="w-full justify-end">
                            <ButtonPrimary icon={<ExperimentOutlined />} onClick={onCreateLabOrder}>
                                Chỉ định CLS
                            </ButtonPrimary>
                            <ButtonPrimary icon={<MedicineBoxOutlined />} onClick={onGotoPrescription}>
                                Kê đơn thuốc
                            </ButtonPrimary>
                            <Divider type="vertical" />
                            <Button
                                color="green"
                                variant="solid"
                                icon={<SaveOutlined />}
                                onClick={onSaveTreatment}
                                loading={isSaving}
                            >
                                Lưu Ca Khám
                            </Button>
                        </Space>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PatientPreCheck;