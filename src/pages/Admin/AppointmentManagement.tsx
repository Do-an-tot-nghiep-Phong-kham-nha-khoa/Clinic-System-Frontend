import { Button, Input, message, Table, Modal } from "antd";
import { useEffect, useState } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { formatDateDDMMYYYY } from "../../utils/date";
import * as AppointmentService from "../../services/AppointmentService";
import type { AppointmentPayload, AppointmentMeta } from "../../services/AppointmentService";
import ButtonPrimary from "../../utils/ButtonPrimary";
import { AiFillEdit } from "react-icons/ai";
import ModalEditAppointment from "../../components/Admin/ModalEditAppointment";
import { getPatient } from "../../services/PatientService";
import type { Patient } from "../../services/PatientService";



const AppointmentManagement = () => {
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
    // cache of patients keyed by id to avoid refetching per-row
    const [patientCache, setPatientCache] = useState<Record<string, Patient | null>>({});

    useEffect(() => {
        fetchAppointments();
    }, [page, pageSize, sort, q]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const result: any = await (AppointmentService as any).getAppointments({ page, limit: pageSize, sort, q });
            const items: AppointmentPayload[] = Array.isArray(result)
                ? result
                : result?.items ?? result?.data ?? result?.appointments ?? [];
            const meta: AppointmentMeta | null = result?.meta ?? null;
            setAppointments(items);
            // prefetch patient records for any profile ids found in appointments
            try {
                // Build a set of patient ids to prefetch.
                // If appointment.profileModel === 'Patient', profile is expected to be the patient id (or an object containing it).
                const idsSet = new Set<string>();
                for (const it of items as any[]) {
                    try {
                        if (it && it.profileModel && String(it.profileModel).toLowerCase() === 'patient') {
                            const prof: any = it.profile;
                            if (typeof prof === 'string') idsSet.add(prof);
                            else if (prof && typeof prof === 'object') {
                                const id: any = prof._id ?? prof.patient_id ?? prof.$oid ?? prof.id;
                                if (typeof id === 'string') idsSet.add(id);
                            }
                            continue;
                        }

                        // fallback: check common fields (profile, booker, patient_id, booker_id)
                        const candidates: any[] = [it.profile, it.booker, it.patient_id, it.booker_id];
                        for (const c of candidates) {
                            if (typeof c === 'string') { idsSet.add(c); break; }
                            if (c && typeof c === 'object') {
                                const id: any = c._id ?? c.patient_id ?? c.$oid ?? c.id;
                                if (typeof id === 'string') { idsSet.add(id); break; }
                            }
                        }
                    } catch (e) {
                        // ignore per-item errors
                    }
                }
                const ids = Array.from(idsSet);
                const missing = ids.filter((id: string) => !(id in patientCache));
                if (missing.length > 0) {
                    const fetched = await Promise.all(missing.map(async (id) => {
                        try {
                            const p = await getPatient(id);
                            return [id, p] as const;
                        } catch (e) {
                            return [id, null] as const;
                        }
                    }));
                    if (fetched.length > 0) {
                        setPatientCache(prev => {
                            const copy = { ...prev };
                            for (const [id, p] of fetched) copy[id] = p;
                            return copy;
                        });
                    }
                }
            } catch (e) {
                // ignore prefetch errors
            }
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

    const openEditModal = async (record: AppointmentPayload) => {
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

        // If appointment explicitly includes a populated patient-like object, prefer that
        const populated = record.patient ?? record.patientData ?? record.profile ?? record.booker;
        if (populated && typeof populated === 'object') {
            return String(populated.fullName ?? populated.name ?? populated.username ?? populated.email ?? JSON.stringify(populated));
        }

        // If profileModel === 'Patient', profile is (or contains) the patient id
        try {
            if (record.profileModel && String(record.profileModel).toLowerCase() === 'patient') {
                // extract id from profile which may be a string or object
                const prof: any = record.profile;
                let id: string | undefined;
                if (typeof prof === 'string') id = prof;
                else if (prof && typeof prof === 'object') id = prof._id ?? prof.patient_id ?? prof.$oid ?? prof.id;

                if (id) {
                    const cached = (patientCache as any)[id];
                    if (cached) return String(cached.name ?? cached.fullName ?? cached.email ?? id);

                    // not cached yet: mark as pending and fetch in background
                    if (!(id in patientCache)) {
                        // mark as loading (null) to avoid duplicate fetches
                        setPatientCache(prev => ({ ...(prev as any), [id]: null }));
                        getPatient(id).then(p => {
                            setPatientCache(prev => ({ ...(prev as any), [id]: p }));
                        }).catch(() => {
                            setPatientCache(prev => ({ ...(prev as any), [id]: null }));
                        });
                    }

                    // return id as temporary placeholder
                    return String(id);
                }
            }
        } catch (e) {
            // ignore extraction errors
        }

        // fallback: primitive fields
        const primitive = record.patientName ?? record.name ?? record.username ?? record.email;
        if (primitive) return String(primitive);

        return '-';
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
            render: (record: AppointmentPayload) => (
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
