import React, { useEffect, useState } from 'react';
import { List, Avatar, Button, Select, Radio, message } from 'antd';
import { getDoctors, type Doctor } from '../../../services/DoctorService';
import { getSpecialties, type Specialty } from '../../../services/SpecialtyService';

interface ChooseDoctorProps {
    onNext: (doctorId: string) => void;
    selectedDoctorId: string | null;
}

const ChooseDoctor: React.FC<ChooseDoctorProps> = ({ onNext, selectedDoctorId }) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [filterSpecialty, setFilterSpecialty] = useState<string | undefined>(undefined);
    const [selected, setSelected] = useState<string | null>(selectedDoctorId || null);

    useEffect(() => {
        (async () => {
            try {
                const sp = await getSpecialties();
                setSpecialties(sp);
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                const docs = await getDoctors(filterSpecialty);
                setDoctors(docs);
            } catch (err) {
                console.error(err);
                message.error('Lỗi tải danh sách bác sĩ');
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

            <List
                itemLayout="horizontal"
                dataSource={safeDoctors}
                renderItem={item => {
                    if (!item || typeof item !== 'object') return null;
                    return (
                        <List.Item
                            actions={[
                                <Button
                                    key={`btn-${item._id}`}
                                    type={selected === item._id ? 'primary' : 'default'}
                                    onClick={() => setSelected(item._id)}
                                >
                                    {selected === item._id ? 'Đã chọn' : 'Chọn'}
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<Avatar src={item.avatar} />}
                                title={item.name}
                                description={item.title}
                            />
                        </List.Item>
                    );
                }}
            />

            <div className="mt-4 flex justify-end">
                <Button
                    type="primary"
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
