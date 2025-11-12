import { useAuth } from "../../contexts/AuthContext";
import { useEffect, useState } from "react";
import { getDoctorByAccountId } from "../../services/DoctorService";
import AppointmentList from "../../components/Doctor/DoctorTreatment/AppointmentList";
import PatientPreCheck from "../../components/Doctor/DoctorTreatment/PatientPreCheck";
import CreateLabOrder from "../../components/Doctor/DoctorTreatment/CreateLabOrder";
import CreatePrescription from "../../components/Doctor/DoctorTreatment/CreatePrescription";
import { message } from "antd";
import { createTreatment, type CreateTreatmentDto } from "../../services/TreatmentService";
import moment, { type Moment } from 'moment';

const DoctorTreatment = () => {
    const { user } = useAuth();
    const [doctorId, setDoctorId] = useState<string>("");
    const [screen, setScreen] = useState<"list" | "precheck" | "createLabOrder" | "prescription">("list");
    const [precheckData, setPrecheckData] = useState({
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        symptoms: "",
        diagnosis: "",
    });
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [currentLabOrderId, setCurrentLabOrderId] = useState<string | null>(null);
    const [currentPrescriptionId, setCurrentPrescriptionId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const load = async () => {
            if (!user?.id) return;
            const data = await getDoctorByAccountId(user.id);
            setDoctorId(data?._id || "");
        };
        load();
    }, [user?.id]);

    const goPreCheck = (appointment: any) => {
        setSelectedAppointment(appointment);
        setCurrentLabOrderId(null);
        setCurrentPrescriptionId(null);
        setPrecheckData({
            bloodPressure: "",
            heartRate: "",
            temperature: "",
            symptoms: "",
            diagnosis: "",
        });
        setScreen("precheck");
    }

    const goBackToPreCheck = () => {
        setScreen("precheck");
    }

    const goLabOrder = () => {
        setScreen("createLabOrder");
    }

    const goPrescription = () => {
        setScreen("prescription");
    }

    const goBackToList = () => {
        setSelectedAppointment(null);
        setCurrentLabOrderId(null);
        setCurrentPrescriptionId(null);
        setScreen("list");
    }

    const handleLabOrderCreated = (labOrderId: string) => {
        setCurrentLabOrderId(labOrderId);
        setScreen("precheck");
    }

    const handlePrescriptionCreated = (prescriptionId: string) => {
        setCurrentPrescriptionId(prescriptionId);
        setScreen("precheck");
    }

    const handleSaveTreatment = async () => {
        if (!selectedAppointment || !doctorId) {
            message.error("Thiếu thông tin cần thiết để lưu ca khám.");
            return;
        }

        const healthProfileId = selectedAppointment.healthProfile_id._id;
        const appointmentId = selectedAppointment._id;
        const date = moment() as Moment;

        // Xây dựng Payload
        const payload: CreateTreatmentDto = {
            healthProfile: healthProfileId,
            doctor: doctorId,
            appointment: appointmentId,
            treatmentDate: date ? moment.utc(date.format('YYYY-MM-DD')).toISOString() : undefined,

            // Dữ liệu từ Precheck
            diagnosis: precheckData.diagnosis,
            bloodPressure: precheckData.bloodPressure,
            heartRate: parseInt(precheckData.heartRate) || 0,
            temperature: parseFloat(precheckData.temperature) || 0,
            symptoms: precheckData.symptoms,

            // ID tùy chọn
            prescription: currentPrescriptionId,
            laborder: currentLabOrderId,
        };

        try {
            setIsSaving(true);
            await createTreatment(payload);

            message.success("Lưu Ca Khám và hoàn tất điều trị thành công!");

            goBackToList();

        } catch (error) {
            console.error("Lỗi khi tạo Treatment:", error);
            message.error(" Lưu ca khám thất bại. Vui lòng kiểm tra lại thông tin.");
        } finally {
            setIsSaving(false);
        }
    }

    if (!doctorId) return <div className="p-4">Loading doctor info...</div>;

    return (
        <div className="p-4">
            {screen === "list" && (
                <AppointmentList doctorId={doctorId} onSelect={goPreCheck} />
            )}

            {screen === "precheck" && selectedAppointment && (
                <PatientPreCheck
                    appointment={selectedAppointment}
                    precheckData={precheckData}
                    onPrecheckDataChange={setPrecheckData}

                    onCreateLabOrder={goLabOrder}
                    onGotoPrescription={goPrescription}
                    isSaving={isSaving}
                    onSaveTreatment={handleSaveTreatment}
                    onBack={goBackToList}
                />
            )}

            {screen === "createLabOrder" && selectedAppointment && (
                <CreateLabOrder
                    healthProfileId={selectedAppointment.healthProfile_id._id}
                    onCreated={handleLabOrderCreated}
                    onBack={goBackToPreCheck}
                />
            )}

            {screen === "prescription" && selectedAppointment && (
                <CreatePrescription
                    healthProfileId={selectedAppointment.healthProfile_id._id}
                    onCreated={handlePrescriptionCreated}
                    onBack={goBackToPreCheck}
                />
            )}
        </div>
    );
}

export default DoctorTreatment;
