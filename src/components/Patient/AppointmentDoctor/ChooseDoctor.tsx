import React, { useEffect, useState } from 'react';
import { List, Avatar, Button, Select, message, Skeleton } from 'antd';
import { getDoctors, type Doctor } from '../../../services/DoctorService';
import { getSpecialties, type Specialty } from '../../../services/SpecialtyService';

interface ChooseDoctorProps {
  onNext: (doctorId: string) => void;
  selectedDoctorId: string | null;
  disabled?: boolean;
}

const ChooseDoctor: React.FC<ChooseDoctorProps> = ({ onNext, selectedDoctorId, disabled }) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [filterSpecialty, setFilterSpecialty] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<string | null>(selectedDoctorId || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const sp = await getSpecialties();
        setSpecialties(sp.items);
      } catch (err) {
        message.error('Lỗi tải danh sách chuyên khoa');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const docs = await getDoctors(filterSpecialty);
        setDoctors(docs);
      } catch (err) {
        message.error('Lỗi tải danh sách bác sĩ');
      } finally {
        setLoading(false);
      }
    })();
  }, [filterSpecialty]);

  const safeDoctors = Array.isArray(doctors) ? doctors : [];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">1. Chọn bác sĩ</h3>

      <div className="mb-4">
        <Select
          placeholder="Lọc theo chuyên khoa (tuỳ chọn)"
          allowClear
          style={{ width: 300 }}
          onChange={(val) => setFilterSpecialty(val)}
        >
          {specialties.map(s => (
            <Select.Option key={s._id} value={s._id}>{s.name}</Select.Option>
          ))}
        </Select>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={safeDoctors}
          renderItem={item => (
            <List.Item
              style={{
                border: selected === item._id ? '2px solid #1677ff' : '1px solid #f0f0f0',
                borderRadius: 8,
                padding: 8,
                transition: 'all 0.2s',
              }}
              actions={[
                <Button
                  key={`btn-${item._id}`}
                  type={selected === item._id ? 'primary' : 'default'}
                  disabled={disabled}
                  onClick={() => !disabled && setSelected(item._id)}
                >
                  {selected === item._id ? 'Đã chọn' : 'Chọn'}
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar src={(item as any).avatar || (item as any).accountId?.avatar || '/default-avatar.png'} />}
                title={<span>{item.name}</span>}
                description={
                  <>
                    <div>{item.title}</div>
                    <div className="text-gray-500 text-sm">
                      {item.specialtyId?.name || 'Không rõ chuyên khoa'}
                    </div>
                  </>
                }
              />
            </List.Item>
          )}
        />
      )}

      <div className="mt-4 flex justify-end">
        <Button
          type="primary"
          disabled={disabled}
          onClick={() => {
            if (!selected) return message.warning('Vui lòng chọn bác sĩ');
            onNext(selected);
          }}
        >
          Tiếp theo
        </Button>
      </div>
    </div>
  );
};

export default ChooseDoctor;
