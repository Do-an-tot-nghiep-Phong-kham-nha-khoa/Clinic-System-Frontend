import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAppointmentsByBooker, type BookerAppointmentModel } from "../../services/AppointmentService";
import { Badge, Calendar, Modal, type CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { getPatientByAccountId } from "../../services/PatientService";
dayjs.extend(utc);

const PatientAppointment = () => {
    const { user } = useAuth();
    const [patientId, setPatientId] = useState<string>("");
    const [appointments, setAppointments] = useState<BookerAppointmentModel[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!user?.id) return;
            const data = await getPatientByAccountId(user.id);
            setPatientId(data?._id || "")
        };
        load();
    }, [user?.id]);

    useEffect(() => {
        if (patientId) {
            loadAppointments();
        }
    }, [patientId]);

    const loadAppointments = async () => {
        try {
            const res = await getAppointmentsByBooker(patientId);
            setAppointments(res.appointments);
        } catch (err) {
            console.error("Lỗi khi tải danh sách cuộc hẹn:", err);
        }
    };

    const getAppointmentsForDate = (date: Dayjs) => {
        return appointments.filter((a) =>
            dayjs.utc(a.appointmentDate).isSame(date, "day")
        );
    };

    const statusToBadge = (status: string) => {
        switch (status) {
            case "pending": return "warning";
            case "waiting_assigned": return "default";
            case "confirmed": return "processing";
            case "completed": return "success";
            case "cancelled": return "error";
            default: return "default";
        }
    };

    const statusToVietnamese = (status: string) => {
        switch (status) {
            case "waiting_assigned": return "Chờ được phân công";
            case "pending": return "Chờ xác nhận";
            case "confirmed": return "Đã xác nhận";
            case "cancelled": return "Đã hủy";
            case "completed": return "Đã hoàn thành";
            default: return status;
        }
    };

    const dateCellRender = (value: Dayjs) => {
        const daily = getAppointmentsForDate(value)
            .sort((a, b) => {
                const startA = a.timeSlot.split("-")[0];
                const startB = b.timeSlot.split("-")[0];
                return startA.localeCompare(startB);
            });

        return (
            <ul>
                {daily.map((a) => (
                    <li key={a._id}>
                        <Badge status={statusToBadge(a.status)} text={`${a.timeSlot}`} />
                    </li>
                ))}
            </ul>
        );
    };

    const onSelect = (value: Dayjs) => {
        setSelectedDate(value.clone());
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedDate(null);
    };

    const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
        if (info.type === "date") {
            return (
                <div onClick={() => onSelect(current)} className="cursor-pointer">
                    {dateCellRender(current)}
                </div>
            );
        }
        return info.originNode;
    };

    return (
        <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-4">Lịch hẹn của tôi</h1>
            <Calendar cellRender={cellRender} className="!p-2" />

            <Modal
                title={`Lịch hẹn vào ngày ${selectedDate ? selectedDate.format("YYYY-MM-DD") : ""}`}
                open={isModalVisible}
                onCancel={handleClose}
                footer={null}
            >
                {selectedDate && (
                    <ul className="p-3">
                        {getAppointmentsForDate(selectedDate)
                            .sort((a, b) => {
                                const startA = a.timeSlot.split("-")[0];
                                const startB = b.timeSlot.split("-")[0];
                                return startA.localeCompare(startB);
                            })
                            .map((a) => (
                                <li key={a._id} className="mb-3 p-3 shadow rounded-md bg-blue-50">
                                    <div className="font-semibold">{a.timeSlot}</div>
                                    <div className="text-sm">Lý do: {a.reason}</div>
                                    <div className="text-sm">Trạng thái: {statusToVietnamese(a.status)}</div>
                                    <div className="text-sm">
                                        Bác sĩ: {a.doctor_id?.name || "Chưa phân công"}
                                    </div>
                                    <div className="text-sm">
                                        Chuyên khoa: {a.specialty_id?.name || "Không rõ"}
                                    </div>
                                </li>
                            ))}
                        {getAppointmentsForDate(selectedDate).length === 0 && (
                            <p>Không có cuộc hẹn trong ngày này.</p>
                        )}
                    </ul>
                )}
            </Modal>
        </div>
    );
};

export default PatientAppointment;
