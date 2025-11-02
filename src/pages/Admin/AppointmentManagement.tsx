import { Button, Input, message, Table, Modal } from "antd";
import { useEffect, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { formatDateDDMMYYYY } from "../../utils/date";
import * as AppointmentService from "../../services/AppointmentService";
import type { Appointment, AppointmentMeta } from "../../services/AppointmentService";
import ButtonPrimary from "../../utils/ButtonPrimary";
import { AiFillEdit } from "react-icons/ai";
import ModalCreateAppointment from "../../components/Admin/ModalCreateAppointment";
import ModalEditAppointment from "../../components/Admin/ModalEditAppointment";

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [meta, setMeta] = useState<AppointmentMeta | null>(null);

    // table query state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<string | undefined>(undefined);
    const [q, setQ] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [createOpen, setCreateOpen] = useState(false);

    const [editOpen, setEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);

    useEffect(() => {
        fetchAppointments();
    }, [page, pageSize, sort, q]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const result: any = await (AppointmentService as any).getAppointments({ page, limit: pageSize, sort, q });
            const items: Appointment[] = Array.isArray(result)
                ? result
                : result?.items ?? result?.data ?? result?.appointments ?? [];
            const meta: AppointmentMeta | null = result?.meta ?? null;
            setAppointments(items);
            setMeta(meta);
            return items;
        }
        catch (error) {
            message.error("Lỗi khi lấy danh sách lịch hẹn");
            return [];
        } finally {
            setLoading(false);
        }
    }

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
            const order = sorter.order as 'ascend' | 'descend' | undefined;
            if (order === 'ascend') setSort(field);
            else if (order === 'descend') setSort(`-${field}`);
            else setSort(undefined);
        } else {
            setSort(undefined);
        }
    };

    const onSearch = () => {
        setPage(1);
        setQ(searchInput.trim());
    };

    const handleOpenCreate = () => {
        setCreateOpen(true);
    };

    const openEditModal = async (record: Appointment) => {
        const id = String(record._id);
        setEditingId(id);
        setEditOpen(true);
    };

    type ID = string | number;

    const handleDelete = async (_id: ID | undefined): Promise<void> => {
        Modal.confirm({
            title: 'Xoá lịch hẹn',
            content: 'Bạn có chắc muốn xoá lịch hẹn này? Hành động này không thể hoàn tác.',
            okText: 'Xoá',
            okType: 'danger',
            cancelText: 'Huỷ',
            onOk: async (): Promise<void> => {
                try {
                    const id = String(_id);
                    await (AppointmentService as any).deleteAppointment(id);
                    message.success("Xoá lịch hẹn thành công");
                    fetchAppointments();
                } catch {
                    message.error("Xoá lịch hẹn thất bại");
                }
            },
        });
    };

    const getPatientName = (record: any): string => {
        if (!record) return '-';
        if (record.patientName) return String(record.patientName);
        // profile may be an object or string
        const profile = record.profile ?? record.booker ?? record.booker_id;
        if (!profile) {
            // fallback to nested patient object
            const p = record.patient ?? record.booker_data ?? record.bookerData;
            if (p) return (p.fullName ?? p.name ?? p.username ?? p.email) || JSON.stringify(p);
            return '-';
        }
        if (typeof profile === 'string') return profile;
        if (typeof profile === 'object') return (profile.fullName ?? profile.name ?? profile.username ?? profile.email) || JSON.stringify(profile);
        return String(profile);
    };

    const getDoctorName = (record: any): string => {
        if (!record) return '-';
        if (record.doctorName) return String(record.doctorName);
        const doc = record.doctor ?? record.doctor_id ?? record.doctorData ?? record.doctor_data;
        if (!doc) return '-';
        if (typeof doc === 'string') return doc;
        if (typeof doc === 'object') return (doc.fullName ?? doc.name ?? doc.username ?? doc.email) || JSON.stringify(doc);
        return String(doc);
    };

    const columns = [
        { title: 'Bệnh nhân', key: 'patientName', render: (_: any, record: any) => getPatientName(record) },
        { title: 'Bác sĩ', key: 'doctorName', render: (_: any, record: any) => getDoctorName(record) },
        {
            title: 'Ngày hẹn',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
            sorter: true,
            width: 160,
            render: (_: any, record: any) => {
                const value = record.appointmentDate ?? record.appointment_date ?? record.createdAt ?? record.appointment_date;
                return formatDateDDMMYYYY(value);
            }
        },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
        {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (record: Appointment) => (
                <span className='flex gap-2'>
                    <ButtonPrimary type="link" shape="round" icon={<AiFillEdit />} onClick={() => openEditModal(record)}>Sửa</ButtonPrimary>
                    <Button type="link" color="danger" variant="solid" shape="round" icon={<FaTrash />} onClick={() => handleDelete(record._id)}>Xoá</Button>
                </span>
            ),
        },
    ]

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Quản lý lịch hẹn</h1>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <ButtonPrimary icon={<MdAdd />} size="large" onClick={handleOpenCreate}>
                        Thêm lịch hẹn
                    </ButtonPrimary>
                </div>
                <div style={{ minWidth: 240, width: '100%', maxWidth: 420 }}>
                    <Input.Search
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Tìm kiếm lịch hẹn..."
                        allowClear
                        enterButton={
                            <Button icon={<FaSearch />}
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    borderColor: 'var(--color-primary)'
                                }} >
                                Search
                            </Button>}
                        className='text-[var(--color-primary)]'
                        onSearch={onSearch}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={appointments}
                rowKey={(record) => record._id || ''}
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

            <ModalCreateAppointment
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => {
                    setPage(1);
                    fetchAppointments();
                }}
            />

            <ModalEditAppointment
                open={editOpen}
                id={editingId}
                onClose={() => { setEditOpen(false); setEditingId(undefined); }}
                onUpdated={() => fetchAppointments()}
            />

        </div>
    )
}

export default AppointmentManagement;
