import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getDoctorByAccountId } from "../../services/DoctorService";
import { getAppointmentsByDoctor, type AppointmentModel, confirmAppointment } from "../../services/AppointmentService";
import type { Dayjs } from "dayjs";
import { Badge, Calendar, Modal, type CalendarProps, Button, message } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { FaCheckCircle } from "react-icons/fa";
dayjs.extend(utc);

const DoctorAppointment = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        loadAppointments();
    }, [user?.id]);

    const loadAppointments = async () => {
        try {
            const res = await getAppointmentsByDoctor(user?.id || "");
            setAppointments(res.appointments);
        } catch (err) {
            console.error(err);
        }
    };

    const getAppointmentsForDate = (date: Dayjs) => {
        // Dùng UTC để không bị lệch ngày khi parse từ DB
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

    const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
        if (info.type === "date") {
            return (
                <div onClick={() => onSelect(current)} className="cursor-pointer">
                    {dateCellRender(current)}
                </div>
            );
        }
        return info.originNode;
    }; const handleClose = () => {
        setIsModalVisible(false);
        setSelectedDate(null);
    };

    const handleConfirmAppointment = async (appointmentId: string) => {
        Modal.confirm({
            title: "Xác nhận lịch hẹn",
            content: "Bạn có chắc chắn muốn xác nhận lịch hẹn này?",
            okText: "Xác nhận",
            cancelText: "Đóng",
            okType: "primary",
            onOk: async () => {
                try {
                    await confirmAppointment(appointmentId);
                    message.success("Xác nhận lịch hẹn thành công!");
                    loadAppointments(); // Reload appointments
                } catch (error: any) {
                    message.error(error.message || "Không thể xác nhận lịch hẹn. Vui lòng thử lại.");
                    console.error("Error confirming appointment:", error);
                }
            }
        });
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

    if (!user?.id) {
        return <div>
            Không tìm thấy bác sĩ liên kết với tài khoản của bạn.
        </div>;
    }

    return (
        <div className="">
            <div className="container mx-auto ">
                <h1 className="text-3xl font-bold mb-4">Danh sách các cuộc hẹn</h1>

                <Calendar cellRender={cellRender} className="!p-2" />
            </div>

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
                            }).map((a) => (
                                <li key={a._id} className="mb-3 p-3 shadow rounded-md bg-blue-50 relative">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="font-semibold">{a.timeSlot}</div>
                                            <div className="text-sm">Lý do: {a.reason}</div>
                                            <div className="text-sm">Trạng thái: {statusToVietnamese(a.status)}</div>
                                            <div className="text-sm">
                                                Bệnh nhân: {a.healthProfile_id.owner_detail.name}
                                            </div>
                                        </div>
                                        {(a.status === "pending" || a.status === "waiting_assigned") && (
                                            <Button
                                                type="text"
                                                icon={<FaCheckCircle size={20} />}
                                                onClick={() => handleConfirmAppointment(a._id)}
                                                title="Xác nhận lịch hẹn"
                                                className="flex items-center justify-center !text-blue-600 !hover:text-blue-800"
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
}
export default DoctorAppointment;