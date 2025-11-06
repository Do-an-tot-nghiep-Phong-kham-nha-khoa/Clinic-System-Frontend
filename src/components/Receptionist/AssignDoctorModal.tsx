import { useEffect, useState } from "react";
import { Modal, Select, Spin, message, Empty } from "antd";
import * as ScheduleService from "../../services/ScheduleService";
import * as AppointmentService from "../../services/AppointmentService";

const { Option } = Select;

type DoctorOption = { _id: string; name: string };

type AppointmentLike = {
  _id: string;
  specialtyId?: string;
  specialty_id?: string;
  appointmentDate?: string; // ISO
  appointment_date?: string;
  timeSlot?: string;        // "HH:MM-HH:MM"
  time_slot?: string;
};

type Props = {
  open: boolean;
  appointment: AppointmentLike | null;
  onClose: () => void;
  onAssigned?: () => void;
};

export default function AssignDoctorModal({ open, appointment, onClose, onAssigned }: Props) {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState<DoctorOption[]>([]);
  const [doctorId, setDoctorId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!open || !appointment) return;
    (async () => {
      try {
        setLoading(true);
        setDoctors([]);
        setDoctorId(undefined);

        const specialty = appointment.specialtyId ?? appointment.specialty_id;
        const date = (appointment.appointmentDate ?? appointment.appointment_date ?? "").slice(0, 10);
        const timeSlot = appointment.timeSlot ?? appointment.time_slot;

        if (!specialty || !date || !timeSlot) {
          message.error("Thiếu dữ liệu lịch hẹn");
          return;
        }

        // 1) Lấy toàn bộ slot trống theo specialty+date
        const avail = await ScheduleService.getAvailableTimeSlotsBySpecialty(String(specialty), date);

        // 2) Lọc đúng khung giờ đang cần
        const [startTime, endTime] = timeSlot.split("-").map(s => s.trim());
        const matched = avail.filter((item) => item.startTime === startTime && item.endTime === endTime);

        if (matched.length === 0) {
          setDoctors([]);
          return;
        }

        // 3) Loại bác sĩ bận (đã có appointment trùng date+timeSlot)
        const final: DoctorOption[] = [];
        for (const slot of matched) {
          const appts = await AppointmentService.getAppointmentsByDoctor(slot.doctor_id);
          const busy = (Array.isArray(appts) ? appts : []).some((a: any) => {
            const aDate = String(a.appointmentDate ?? a.appointment_date ?? "").slice(0, 10);
            const aTime = String(a.timeSlot ?? a.time_slot ?? "");
            return aDate === date && aTime === timeSlot;
          });
          if (!busy) final.push({ _id: slot.doctor_id, name: slot.doctor_name ?? "Bác sĩ" });
        }

        setDoctors(final);
        if (final.length === 0) message.info("Không có bác sĩ khả dụng cho khung giờ này");
      } catch (err) {
        console.error("AssignDoctorModal loadDoctors error", err);
        message.error("Không thể tải danh sách bác sĩ");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, appointment]);

  const handleOk = async () => {
    if (!appointment) return;
    if (!doctorId) return message.warning("Chọn bác sĩ");

    try {
      setLoading(true);
      await AppointmentService.assignDoctor(String(appointment._id), String(doctorId));
      message.success("Gán bác sĩ thành công");
      onAssigned?.();
      onClose();
    } catch (e) {
      console.error('AssignDoctorModal.assignDoctor error', e);
      message.error("Gán bác sĩ thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onCancel={onClose} onOk={handleOk} okText="Gán bác sĩ" title="Chọn bác sĩ">
      {loading ? (
        <div style={{ textAlign: 'center', padding: 24 }}><Spin /></div>
      ) : doctors.length === 0 ? (
        <Empty description="Không có bác sĩ khả dụng" />
      ) : (
        <Select
          style={{ width: '100%' }}
          value={doctorId}
          onChange={(v) => setDoctorId(String(v))}
          placeholder="Chọn bác sĩ"
        >
          {doctors.map((d) => (
            <Option key={d._id} value={d._id}>
              {d.name}
            </Option>
          ))}
        </Select>
      )}
    </Modal>
  );
}
