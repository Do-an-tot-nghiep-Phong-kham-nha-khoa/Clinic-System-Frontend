import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, DatePicker, message } from "antd";
import dayjs, { Dayjs } from "dayjs";

import * as DoctorService from "../../services/DoctorService";
import * as PatientService from "../../services/PatientService";
import * as ReceptionistService from "../../services/ReceptionistService";
import * as AdminService from "../../services/AdminService";

const { Option } = Select;

interface ModalViewAccountProps {
  open: boolean;
  onClose: () => void;
  accountId: string;
  role: "doctor" | "patient" | "receptionist" | "admin";
}

interface DoctorProfile {
  _id: string;
  accountId: any;
  name: string;
  specialtyName: string;
  phone: string;
  experience: number;
}

interface PatientProfile {
  _id: string;
  accountId: any;
  name: string;
  gender: string;
  phone: string;
  address: string;
  dob: Dayjs;
}

interface ReceptionistProfile {
  _id: string;
  accountId: any;
  name: string;
  phone: string;
  shift: string;
}

interface AdminProfile {
  _id: string;
  accountId: any;
  name: string;
  phone: string;
}

type ProfileData =
  | DoctorProfile
  | PatientProfile
  | ReceptionistProfile
  | AdminProfile;

type CacheEntry = {
  timestamp: number;
  data: ProfileData;
};

const CACHE_TTL = 60 * 1000; // 60s
const cache: Record<string, CacheEntry> = {};

const ModalViewAccount: React.FC<ModalViewAccountProps> = ({
  open,
  onClose,
  accountId,
  role,
}) => {
  const [form] = Form.useForm<ProfileData>();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const fetchProfile = async () => {
    const cacheKey = `${role}-${accountId}`;
    const now = Date.now();

    // Nếu cache còn hiệu lực thì dùng luôn
    if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
      form.setFieldsValue(cache[cacheKey].data);
      setProfile(cache[cacheKey].data);
      return;
    }

    try {
      let res: any;

      if (role === "doctor") res = await DoctorService.getDoctorByAccountId(accountId);
      if (role === "patient") res = await PatientService.getPatientByAccountId(accountId);
      if (role === "receptionist") res = await ReceptionistService.getReceptionistByAccountId(accountId);
      if (role === "admin") res = await AdminService.getAdminByAccountId(accountId);

      if (!res) return;

      let data: ProfileData;

      if (role === "doctor") {
        const d = res as any;
        data = {
          _id: d._id,
          accountId: d.accountId,
          name: d.name,
          phone: d.phone,
          experience: d.experience,
          specialtyName: d.specialtyId?.name || "",
        };
      } else if (role === "patient") {
        const p = res as any;
        data = {
          _id: p._id,
          accountId: p.accountId,
          name: p.name,
          gender: p.gender,
          phone: p.phone,
          address: p.address,
          dob: p.dob ? dayjs(p.dob) : undefined,
        };
      } else if (role === "receptionist") {
        const r = res as any;
        data = {
          _id: r._id,
          accountId: r.accountId,
          name: r.name,
          phone: r.phone,
          shift: r.shift,
        };
      } else {
        const a = res as any;
        data = {
          _id: a._id,
          accountId: a.accountId,
          name: a.name,
          phone: a.phone,
        };
      }

      // set form và state
      form.setFieldsValue(data);
      setProfile(data);

      // lưu cache
      cache[cacheKey] = { data, timestamp: now };
    } catch (err) {
      message.error("Không thể tải dữ liệu");
    }
  };

  const submitEdit = async () => {
    if (!profile) return;

    try {
      const values = form.getFieldsValue();
      const payload: any = { ...values };

      // Chỉ convert dob nếu là patient
      if (role === "patient" && payload.dob && dayjs.isDayjs(payload.dob)) {
        payload.dob = (payload.dob as Dayjs).toISOString();
      }

      if (role === "doctor") await DoctorService.updateDoctor(profile._id, payload);
      if (role === "patient") await PatientService.updatePatient(profile._id, payload);
      if (role === "receptionist") await ReceptionistService.updateReceptionist(profile._id, payload);
      if (role === "admin") await AdminService.updateAdmin(profile._id, payload);

      message.success("Cập nhật thành công");
      onClose();

      // update cache
      const cacheKey = `${role}-${accountId}`;
      cache[cacheKey] = { data: payload, timestamp: Date.now() };
    } catch {
      message.error("Cập nhật thất bại");
    }
  };

  useEffect(() => {
    if (open) fetchProfile();
  }, [open]);

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={submitEdit}
      title="Thông tin hồ sơ"
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {(role === "patient") && (
          <Form.Item name="gender" label="Giới tính" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "nam", value: "male" },
                { label: "nữ", value: "female" },
              ]}
            />
          </Form.Item>
        )}

        <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {role === "patient" && (
          <Form.Item name="address" label="Địa chỉ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        )}

        {role === "doctor" && (
          <Form.Item name="specialtyName" label="Chuyên khoa" rules={[{ required: true }]}>
            <Select placeholder="Chọn chuyên khoa">
              <Option value="Tim mạch">Tim mạch</Option>
              <Option value="Nhi">Nhi</Option>
              <Option value="Da liễu">Da liễu</Option>
              <Option value="Tai Mũi Họng">Tai Mũi Họng</Option>
              <Option value="Nội tổng quát">Nội tổng quát</Option>
              <Option value="Sản phụ khoa">Sản phụ khoa</Option>
            </Select>
          </Form.Item>
        )}

        {role === "receptionist" && (
          <Form.Item name="shift" label="Ca làm" rules={[{ required: true }]}>
            <Select
              options={[
                { label: "Sáng", value: "morning" },
                { label: "Chiều", value: "afternoon" },
                { label: "Tối", value: "evening" },
              ]}
            />
          </Form.Item>
        )}

        {role === "patient" && (
          <Form.Item name="dob" label="Ngày sinh" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        )}
        {
          role === "doctor" && (
            <Form.Item name="experience" label="Kinh nghiệm (năm)" rules={[{ required: true }]}>
              <Input type="number" min={0} />
            </Form.Item>
          )
        }
      </Form>
    </Modal>
  );
};

export default ModalViewAccount;
