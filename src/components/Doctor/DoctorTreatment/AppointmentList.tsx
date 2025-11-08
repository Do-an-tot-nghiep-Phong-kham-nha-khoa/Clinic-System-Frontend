import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import dayjs from "dayjs";
import { getAppointmentsByDoctor } from "../../../services/AppointmentService";

interface Props {
    doctorId: string;
    onSelect: (app: any) => void;
}
const AppointmentList = ({ onSelect, doctorId }: Props) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        const res = await getAppointmentsByDoctor(doctorId);
        setData(res.appointments);
        setLoading(false);
    };

    const columns = [
        {
            title: "Tên bệnh nhân",
            dataIndex: ["healthProfile_id", "owner_detail", "name"]
        },
        {
            title: "Ngày hẹn",
            render: (r: any) => dayjs(r.appointmentDate).format("DD/MM/YYYY")
        },
        {
            title: "Khung giờ",
            dataIndex: "timeSlot"
        },
        {
            title: "Lý do",
            dataIndex: "reason"
        },
        {
            title: "Trạng thái",
            render: (r: any) => <Tag color="blue">{r.status}</Tag>
        },
        {
            title: "Action",
            render: (r: any) => (
                <button
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    onClick={() => onSelect(r)}
                >
                    Khám
                </button>
            )
        }
    ];

    return (
        <div>
            <h2 className="text-xl font-semibold mb-4">Danh sách cuộc hẹn</h2>

            <Table
                loading={loading}
                dataSource={data}
                columns={columns}
                rowKey="_id"
                pagination={false}
            />
        </div>
    );
};

export default AppointmentList;
