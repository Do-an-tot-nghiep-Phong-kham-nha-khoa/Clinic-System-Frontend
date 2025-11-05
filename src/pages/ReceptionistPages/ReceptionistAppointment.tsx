import { useEffect, useState } from "react";
import { Table, Button, Select, message, Spin, Empty } from "antd";
import { formatDateDDMMYYYY } from "../../utils/date";
import * as AppointmentService from "../../services/AppointmentService";
import * as SpecialtyService from "../../services/SpecialtyService";
import AssignDoctorModal from "../../components/Receptionist/AssignDoctorModal";
import type { AppointmentPayload } from "../../services/AppointmentService";
import type { Specialty } from "../../services/SpecialtyService";

const { Option } = Select;

const ReceptionistAppointment = () => {
    const [appointments, setAppointments] = useState<AppointmentPayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [filterSpecialty, setFilterSpecialty] = useState<string | undefined>(undefined);

    // modal state
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<AppointmentPayload | null>(null);

    useEffect(() => {
        fetchSpecialties();
        fetchAppointments();
    }, []);

    useEffect(() => {
        // when filter changes, refetch appointments
        fetchAppointments();
    }, [filterSpecialty]);

    const fetchSpecialties = async () => {
        try {
            const res = await SpecialtyService.getSpecialties();
            setSpecialties(Array.isArray(res) ? res : []);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            // fetch a reasonably large page so receptionist can see unassigned items
            const params: any = { page: 1, limit: 200 };
            if (filterSpecialty) params.specialty_id = filterSpecialty;
            const result: any = await AppointmentService.getAppointments(params);
            const items: AppointmentPayload[] = Array.isArray(result)
                ? result
                : result?.items ?? result?.data ?? result?.appointments ?? [];

            // keep only doctorless appointments (no doctor assigned)
            const doctorless = items.filter(it => {
                if (!it) return false;
                const doc = (it as any).doctor ?? (it as any).doctor_id ?? (it as any).doctorData ?? (it as any).doctor_data;
                return !doc;
            });

            setAppointments(doctorless);
        } catch (e) {
            console.error(e);
            message.error("Lỗi khi lấy lịch hẹn");
        } finally {
            setLoading(false);
        }
    };

    const openAssignModal = async (appointment: AppointmentPayload) => {
        try {
            // if appointment is already marked waiting_assigned, skip update
            const currentStatus = appointment.status ?? appointment.status;
            if (currentStatus !== 'waiting_assigned') {
                // ask backend to change status to waiting_assigned before assigning
                const updated = await AppointmentService.updateAppointment(String(appointment._id ?? appointment.booker_id ?? ''), 'waiting_assigned');
                if (updated) {
                    setSelectedAppointment(updated as AppointmentPayload);
                } else {
                    // fallback to original if update didn't return updated object
                    setSelectedAppointment(appointment);
                }
            } else {
                setSelectedAppointment(appointment);
            }
            setAssignModalOpen(true);
        } catch (err: any) {
            console.error('Failed to set appointment to waiting_assigned', err);
            message.error(err?.response?.data?.message ?? 'Không thể chuyển trạng thái lịch hẹn');
            // still open modal with original appointment so receptionist can try manual action
            setSelectedAppointment(appointment);
            setAssignModalOpen(true);
        }
    };

    // Assign flow is handled inside AssignDoctorModal; onAssigned callback will refresh the list

    const columns = [
        { title: 'Bệnh nhân', key: 'patient', render: (_: any, record: any) => {
            const patient = record.patient ?? record.booker ?? record.profile;
            if (patient && typeof patient === 'object') return String(patient.name ?? patient.fullName ?? patient.username ?? '-');
            return String(patient ?? (record.patientName ?? record.name) ?? '-');
        }},
        { title: 'Chuyên khoa', key: 'specialty', render: (_: any, record: any) => {
            const s = record.specialty ?? record.specialty_id ?? record.specialtyId;
            if (!s) return '-';
            if (typeof s === 'string') return s;
            if (typeof s === 'object') return s.name ?? s.title ?? JSON.stringify(s);
            return '-';
        }},
        { title: 'Ngày', dataIndex: 'appointmentDate', key: 'appointmentDate', render: (_: any, record: any) => {
            const val = record.appointmentDate ?? record.appointment_date ?? record.createdAt;
            return formatDateDDMMYYYY(val);
        }},
        { title: 'Giờ', key: 'time', render: (_: any, record: any) => record.time_slot ?? record.timeSlot ?? '-' },
        { title: 'Hành động', key: 'actions', render: (_: any, record: AppointmentPayload) => (
            <div className="flex gap-2">
                <Button type="primary" onClick={() => openAssignModal(record)}>Gán bác sĩ</Button>
            </div>
        )}
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Lịch hẹn chưa phân bác sĩ</h1>

            <div className="mb-4 flex items-center gap-4">
                <div style={{ minWidth: 200 }}>
                    <Select allowClear placeholder="Lọc theo chuyên khoa" style={{ width: 300 }} value={filterSpecialty} onChange={(v) => setFilterSpecialty(v)}>
                        {specialties.map(s => <Option key={s._id} value={s._id}>{s.name}</Option>)}
                    </Select>
                </div>
                <div className="flex-1" />
            </div>

            {loading ? <Spin /> : (
                appointments.length === 0 ? <Empty description="Không có lịch hẹn chưa phân bác sĩ" /> : (
                    <Table
                        columns={columns}
                        dataSource={appointments}
                        rowKey={(r) => String(r._id ?? Math.random())}
                        pagination={{ pageSize: 10 }}
                    />
                )
            )}

            <AssignDoctorModal
                open={assignModalOpen}
                appointment={selectedAppointment}
                onClose={() => { setAssignModalOpen(false); setSelectedAppointment(null); }}
                onAssigned={async () => { setAssignModalOpen(false); setSelectedAppointment(null); await fetchAppointments(); }}
            />
        </div>
    );
}

export default ReceptionistAppointment;