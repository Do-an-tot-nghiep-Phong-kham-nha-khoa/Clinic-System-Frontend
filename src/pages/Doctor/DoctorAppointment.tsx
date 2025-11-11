import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getDoctorByAccountId } from "../../services/DoctorService";
import { getAppointmentsByDoctor, type AppointmentModel } from "../../services/AppointmentService";
import type { Dayjs } from "dayjs";
import { Badge, Calendar, Modal, type CalendarProps } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

const DoctorAppointment = () => {
    const { user } = useAuth();
    const [doctorId, setDoctorId] = useState<string>("");
    const [appointments, setAppointments] = useState<AppointmentModel[]>([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

    useEffect(() => {
        const load = async () => {
            if (!user?.id) return;
            const data = await getDoctorByAccountId(user.id);
            setDoctorId(data?._id || "");
        };
        load();
    }, [user?.id]);

    useEffect(() => {
        if (doctorId) {
            loadAppointments();
        }
    }, [doctorId]);


    const loadAppointments = async () => {
        try {
            const res = await getAppointmentsByDoctor(doctorId);
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
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setSelectedDate(null);
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

    if (!doctorId) {
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
                            })
                            .map((a) => (
                                <li key={a._id} className="mb-3 p-3 shadow rounded-md bg-blue-50">
                                    <div className="font-semibold">{a.timeSlot}</div>
                                    <div className="text-sm">Lý do: {a.reason}</div>
                                    <div className="text-sm">Trạng thái: {statusToVietnamese(a.status)}</div>
                                    <div className="text-sm">
                                        Bệnh nhân: {a.healthProfile_id.owner_detail.name}
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