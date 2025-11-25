import { Button, Input, message, Table, Modal, Tag  } from "antd";
import { useEffect, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { formatDateDDMMYYYY } from "../../utils/date";
import * as AppointmentService from "../../services/AppointmentService";
import type { AppointmentPayload, AppointmentMeta } from "../../services/AppointmentService";
import ButtonPrimary from "../../utils/ButtonPrimary";
import { AiFillEdit } from "react-icons/ai";
import { ClockCircleOutlined, CheckCircleOutlined, SolutionOutlined, CloseCircleOutlined } from "@ant-design/icons";
import ModalEditAppointment from "../../components/Admin/ModalEditAppointment";

const { Search } = Input;

const ReceptionistManageAppointment = () => {
    const [appointments, setAppointments] = useState<AppointmentPayload[]>([]);
    const [meta, setMeta] = useState<AppointmentMeta | null>(null);

    // table query state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<string | undefined>(undefined);
    const [q, setQ] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);

    useEffect(() => {
        fetchAppointments();
    }, [page, pageSize, sort, q]);
    const getStatusTag = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <Tag icon={<ClockCircleOutlined />} color="orange">Đang chờ</Tag>;
            case "confirmed":
                return <Tag icon={<CheckCircleOutlined />} color="blue">Đã xác nhận</Tag>;
            case "completed":
                return <Tag icon={<SolutionOutlined />} color="green">Đã hoàn thành</Tag>;
            case "cancelled":
                return <Tag icon={<CloseCircleOutlined />} color="red">Đã hủy</Tag>;
            case "waiting_assigned":
                return <Tag icon={<ClockCircleOutlined />} color="purple">Chờ phân công</Tag>;
            default:
                return <Tag>{status}</Tag>;
        }
    };
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const result: any = await (AppointmentService as any).getAppointments({
                page,
                limit: pageSize,
                sort,
                q,
            });

            // normalize result -> items array
            const items: AppointmentPayload[] = Array.isArray(result)
                ? result
                : result?.items ?? result?.data ?? result?.appointments ?? [];

            const metaObj: AppointmentMeta | null = result?.meta ?? null;

            setAppointments(items);
            setMeta(metaObj);
            return items;
        } catch (error: any) {
            console.error("fetchAppointments error:", error);
            message.error("Lỗi khi lấy danh sách lịch hẹn");
            return [];
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (
        pagination: { current?: number; pageSize?: number },
        _filters: any,
        sorter: any
    ) => {
        // pagination
        if (pagination.current) setPage(pagination.current);
        if (pagination.pageSize) setPageSize(pagination.pageSize);

        // sorting
        if (Array.isArray(sorter)) {
            sorter = sorter[0];
        }
        if (sorter && sorter.field) {
            const field = sorter.field as string;
            const order = sorter.order as "ascend" | "descend" | undefined;
            if (order === "ascend") setSort(field);
            else if (order === "descend") setSort(`-${field}`);
            else setSort(undefined);
        } else {
            setSort(undefined);
        }
    };

    const onSearch = () => {
        setPage(1);
        setQ(searchInput.trim());
    };

    const openEditModal = (record: AppointmentPayload) => {
        const id = String((record as any)._id);
        setEditingId(id);
        setEditOpen(true);
        // console.log("openEditModal called", id, editOpen);

    };

    type ID = string | number;

    const handleDelete = async (_id: ID | undefined): Promise<void> => {
        Modal.confirm({
            title: "Xoá lịch hẹn",
            content: "Bạn có chắc muốn xoá lịch hẹn này? Hành động này không thể hoàn tác.",
            okText: "Xoá",
            okType: "danger",
            cancelText: "Huỷ",
            onOk: async (): Promise<void> => {
                try {
                    const id = String(_id);
                    await AppointmentService.deleteAppointment(id);
                    message.success("Xoá lịch hẹn thành công");
                    fetchAppointments();
                } catch (err) {
                    console.error("deleteAppointment error:", err);
                    message.error("Xoá lịch hẹn thất bại");
                }
            },
        });
    };

    // Helpers adapted to your JSON shape
    const getPatientName = (record: any): string => {
        if (!record) return "-";
        // prefer booker_id.name (your sample)
        if (record.booker_id) {
            const booker = record.booker_id;
            if (typeof booker === "string") return booker;
            return String(booker.name ?? booker.fullName ?? booker.username ?? booker.email ?? "-");
        }
        // fallback: check some common fields
        const primitive = record.patientName ?? record.name ?? record.username ?? record.email;
        return primitive ? String(primitive) : "-";
    };

    const getDoctorName = (record: any): string => {
        if (!record) return "-";
        const doc = record.doctor_id;
        if (!doc) return "-";
        if (typeof doc === "string") return doc;
        return String(doc.name ?? doc.fullName ?? doc.username ?? doc.email ?? "-");
    };
    const columns = [
        {
            title: "Bệnh nhân",
            key: "patientName",
            render: (_: any, record: any) => getPatientName(record),
        },
        {
            title: "Bác sĩ",
            key: "doctorName",
            render: (_: any, record: any) => getDoctorName(record),
        },
        {
            title: "Ngày hẹn",
            dataIndex: "appointmentDate",
            key: "appointmentDate",
            sorter: true,
            width: 160,
            render: (_: any, record: any) => {
                const dateVal = record.appointmentDate ?? record.appointment_date ?? record.createdAt;
                return formatDateDDMMYYYY(dateVal);
            },
        },
        {
            title: "Khung giờ",
            dataIndex: "timeSlot",
            key: "timeSlot",
            render: (_: any, record: any) => record.timeSlot ?? record.time_slot ?? "-",
        },
        {
            title: "Chuyên khoa",
            key: "specialty",
            render: (_: any, record: any) => record?.specialty_id?.name ?? record?.specialty?.name ?? "-",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: string) => getStatusTag(status),
        },
        {
            title: "Lý do",
            dataIndex: "reason",
            key: "reason",
        },
        {
            title: "Actions",
            key: "actions",
            width: 120,
            render: (record: AppointmentPayload) => (
                <span className="flex gap-2">
                    <ButtonPrimary
                        type="link"
                        shape="round"
                        icon={<AiFillEdit />}
                        onClick={() => openEditModal(record)}
                    >
                        Sửa
                    </ButtonPrimary>
                    <Button
                        type="link"
                        danger
                        shape="round"
                        icon={<FaTrash />}
                        onClick={() => handleDelete((record as any)._id)}
                    >
                        Xoá
                    </Button>
                </span>
            ),
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Quản lý lịch hẹn</h1>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div style={{ minWidth: 240, width: "100%", maxWidth: 420 }}>
                    <Search
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Tìm kiếm lịch hẹn..."
                        allowClear
                        enterButton={
                            <Button
                                icon={<FaSearch />}
                                style={{
                                    backgroundColor: "var(--color-primary)",
                                    color: "white",
                                    borderColor: "var(--color-primary)",
                                }}
                            >
                                Search
                            </Button>
                        }
                        className="text-[var(--color-primary)]"
                        onSearch={onSearch}
                    />
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={appointments}
                rowKey={(record) => (record as any)._id ?? ""}
                loading={loading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: meta?.total ?? appointments.length,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20, 50],
                }}
                onChange={handleTableChange}
            />

            <ModalEditAppointment
                open={editOpen}
                id={editingId}
                onClose={() => {
                    setEditingId(undefined);
                    setEditOpen(false);
                }}
                onUpdated={() => fetchAppointments()}
            />
        </div>
    );
};

export default ReceptionistManageAppointment;
