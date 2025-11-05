import { useEffect, useState } from 'react';
import { Modal, Select, message, Spin } from 'antd';
import * as DoctorService from '../../services/DoctorService';
import * as AppointmentService from '../../services/AppointmentService';
import { toDate, formatDateDDMMYYYY } from '../../utils/date';
import type { Doctor } from '../../services/DoctorService';
import type { AppointmentPayload } from '../../services/AppointmentService';

const { Option } = Select;

type Candidate = { doctor: Doctor; busy: boolean };

type Props = {
    open: boolean;
    appointment: AppointmentPayload | null;
    onClose: () => void;
    onAssigned?: () => void;
};

export default function AssignDoctorModal({ open, appointment, onClose, onAssigned }: Props) {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);

    // helper: extract plain id string from various shapes (string, object with _id, Mongoose ObjectId)
    const pickId = (x: any): string | null => {
        if (x === null || x === undefined) return null;
        if (typeof x === 'string' || typeof x === 'number') return String(x);
        if (typeof x === 'object') {
            if (x._id && (typeof x._id === 'string' || typeof x._id === 'number')) return String(x._id);
            if (x.id && (typeof x.id === 'string' || typeof x.id === 'number')) return String(x.id);
            if (x.$oid && (typeof x.$oid === 'string' || typeof x.$oid === 'number')) return String(x.$oid);
            try {
                const s = (x as any).toString();
                if (s && s !== '[object Object]') return s;
            } catch (e) { /* ignore */ }
        }
        return null;
    };

    useEffect(() => {
        if (!open || !appointment) return;
        let mounted = true;
        (async () => {
            setLoading(true);
            setCandidates([]);
            setSelectedDoctorId(undefined);
            try {
                const specialtyRaw = (appointment as any).specialty_id ?? (appointment as any).specialtyId ?? (appointment as any).specialty;
                const specialtyId = pickId(specialtyRaw);
                if (!specialtyId) {
                    message.warning('Không tìm thấy chuyên khoa của lịch hẹn');
                    return;
                }

                // fetch doctors (accept arrays or paginated shapes)
                const raw: any = await DoctorService.getDoctorsBySpecialty(specialtyId);
                const doctors: Doctor[] = Array.isArray(raw) ? raw : raw?.items ?? raw?.data ?? raw?.doctors ?? [];

                // compute appointment date & timeslot
                const apptDateStr = (appointment as any).appointmentDate ?? (appointment as any).appointment_date ?? appointment.createdAt ?? null;
                const apptDate = toDate(apptDateStr);
                const apptTimeSlot = (appointment as any).time_slot ?? (appointment as any).timeSlot ?? (appointment as any).timeSlotName ?? (appointment as any).time_slot_name;

                const list: Candidate[] = [];
                for (const d of doctors) {
                    // match schedule if available
                    let matchesSchedule = true;
                    if (apptDate && Array.isArray(d.schedule)) {
                        const dayName = apptDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
                        const found = d.schedule.find(s => String(s.day ?? '').toLowerCase().includes(dayName) || dayName.includes(String(s.day ?? '').toLowerCase()));
                        if (!found) matchesSchedule = false;
                        else if (apptTimeSlot && Array.isArray(found.timeSlots) && !found.timeSlots.includes(apptTimeSlot)) matchesSchedule = false;
                    }

                    let busy = false;
                    try {
                        const docAppts = await AppointmentService.getAppointmentsByDoctor(String(d._id));
                        if (Array.isArray(docAppts)) {
                            for (const da of docAppts) {
                                const daDate = (da as any).appointmentDate ?? (da as any).appointment_date ?? da.createdAt;
                                const daTime = (da as any).time_slot ?? (da as any).timeSlot;
                                const sameDate = apptDate && toDate(daDate) && (toDate(daDate)!.toDateString() === apptDate!.toDateString());
                                if (sameDate && apptTimeSlot && daTime === apptTimeSlot) {
                                    busy = true; break;
                                }
                            }
                        }
                    } catch (e) {
                        // ignore per-doctor fetch errors but log
                        console.debug('getAppointmentsByDoctor error', e);
                    }

                    if (matchesSchedule) list.push({ doctor: d, busy });
                }

                if (mounted) setCandidates(list);
            } catch (err: any) {
                console.error('AssignDoctorModal load error', err);
                const serverMsg = err?.response?.data?.message ?? err?.message ?? 'Lỗi khi tải danh sách bác sĩ';
                message.error(serverMsg);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [open, appointment]);

    const handleOk = async () => {
        if (!appointment) return;
        if (!selectedDoctorId) { message.warning('Vui lòng chọn bác sĩ'); return; }

        // check status quickly
        const status = (appointment as any).status ?? (appointment as any).appointmentStatus;
        if (status && String(status) !== 'waiting_assigned') {
            message.warning('Chỉ các lịch ở trạng thái "waiting_assigned" mới được phân công');
            return;
        }

            // check selected candidate availability from previously computed list
            const chosen = candidates.find(c => String(c.doctor._id) === String(selectedDoctorId));
            if (chosen && chosen.busy) {
                message.warning('Bác sĩ đã bận tại khung giờ này, vui lòng chọn bác sĩ khác');
                return;
            }

            try {
                setAssigning(true);
                // backend expects PUT /appointments/:id/assign-doctor with { doctor_id }
                await AppointmentService.assignDoctor(String(appointment._id), selectedDoctorId);
                message.success('Gán bác sĩ thành công');
                onAssigned?.();
                onClose();
            } catch (err: any) {
                console.error('AssignDoctorModal assign error', err, err?.response?.data);
                const serverMsg = err?.response?.data?.message ?? err?.message ?? 'Gán bác sĩ thất bại';
                const serverDetail = err?.response?.data?.error ? (` — ${err.response.data.error}`) : '';
                message.error(serverMsg + serverDetail);
            } finally {
                setAssigning(false);
            }
    };

    return (
        <Modal
            title={`Gán bác sĩ cho lịch hẹn`}
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            okText="Gán"
            confirmLoading={assigning}
        >
            {!appointment ? <div>Không có lịch hẹn được chọn</div> : (
                <div className="space-y-4">
                    <div>Ngày: {formatDateDDMMYYYY((appointment as any).appointmentDate ?? (appointment as any).appointment_date)}</div>
                    <div>Giờ: {(appointment as any).time_slot ?? (appointment as any).timeSlot ?? '-'}</div>

                    <div>
                        <label className="block mb-2">Chọn bác sĩ</label>
                        {loading ? <Spin /> : (
                            candidates.length === 0 ? (
                                <div>Không tìm thấy bác sĩ phù hợp cho chuyên khoa/khung giờ này.</div>
                            ) : (
                                <Select style={{ width: '100%' }} value={selectedDoctorId} onChange={(v) => setSelectedDoctorId(v)}>
                                    {candidates.map(c => (
                                        <Option key={c.doctor._id} value={c.doctor._id} disabled={c.busy}>
                                            {`${c.doctor.name ?? c.doctor._id} ${c.busy ? '(Đã bận)' : ''}`}
                                        </Option>
                                    ))}
                                </Select>
                            )
                        )}
                    </div>
                </div>
            )}
        </Modal>
    );
}
