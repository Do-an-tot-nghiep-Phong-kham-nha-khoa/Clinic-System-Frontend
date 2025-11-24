import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAppointmentsByBooker, type BookerAppointmentModel, cancelAppointment } from "../../services/AppointmentService";
import { Badge, Calendar, Modal, type CalendarProps, Button, message } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { MdCancel } from "react-icons/md";
dayjs.extend(utc);

const PatientAppointment = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<BookerAppointmentModel[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        loadAppointments();
    }, [user?.id]);

    const loadAppointments = async () => {
        try {
            const res = await getAppointmentsByBooker(user?.id || "");
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
    }; const handleClose = () => {
        setIsModalVisible(false);
        setSelectedDate(null);
    };

    const handleCancelAppointment = async (appointmentId: string) => {
        Modal.confirm({
            title: "Xác nhận hủy lịch hẹn",
            content: "Bạn có chắc chắn muốn hủy lịch hẹn này?",
            okText: "Hủy lịch hẹn",
            cancelText: "Đóng",
            okType: "danger",
            onOk: async () => {
                try {
                    await cancelAppointment(appointmentId);
                    message.success("Hủy lịch hẹn thành công!");
                    loadAppointments(); // Reload appointments
                } catch (error: any) {
                    message.error(error.message || "Không thể hủy lịch hẹn. Vui lòng thử lại.");
                    console.error("Error cancelling appointment:", error);
                }
            }
        });
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

    if (!user?.id) return <div className="p-4">Loading user info...</div>;

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
                                <li key={a._id} className="mb-3 p-3 shadow rounded-md bg-blue-50 relative">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-semibold">{a.timeSlot}</div>
                                            <div className="text-sm">Lý do: {a.reason}</div>
                                            <div className="text-sm">Trạng thái: {statusToVietnamese(a.status)}</div>
                                            <div className="text-sm">
                                                Bác sĩ: {a.doctor_id?.name || "Chưa phân công"}
                                            </div>
                                            <div className="text-sm">
                                                Chuyên khoa: {a.specialty_id?.name || "Không rõ"}
                                            </div>
                                        </div>
                                        {(a.status === "pending" || a.status === "waiting_assigned" || a.status === "confirmed") && (
                                            <Button
                                                type="text"
                                                danger
                                                icon={<MdCancel size={20} />}
                                                onClick={() => handleCancelAppointment(a._id)}
                                                title="Hủy lịch hẹn"
                                                className="flex items-center justify-center"
                                            />
                                        )}
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
