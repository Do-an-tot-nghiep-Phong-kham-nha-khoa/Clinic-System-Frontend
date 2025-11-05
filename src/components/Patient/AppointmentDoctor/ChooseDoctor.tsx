import { Col, Row, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { getDoctors, type Doctor } from '../../../services/DoctorService';
import DoctorCard from '../../Doctor/DoctorCard';

const { Title, Paragraph } = Typography;

type Props = {
    onNext: (doctorId: string) => void;
    selectedDoctorId: string | null;
    disabled?: boolean;
};

const ChooseDoctor: React.FC<Props> = ({ onNext, selectedDoctorId, disabled }) => {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        setLoading(true);
        try {
            // getDoctors now returns a paginated shape { items, total, page, limit }
            const res = await getDoctors({ page: 1, limit: 9 });
            setDoctors(res.items || []);
        } catch (e) {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (id: string) => {
        if (!disabled) onNext(id);
    };

    // show grid 3x3 using Col md=8
    return (
        <div className="p-4">
            <Title level={3} className="mb-4">1. Chọn Bác Sĩ</Title>
            {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
                <Row gutter={[16, 16]}>
                    {doctors.length > 0 ? (
                        doctors.map((doc) => (
                            <Col xs={24} sm={12} md={8} key={doc._id}>
                                <DoctorCard doctor={doc} onClick={() => handleSelect(doc._id)} selected={selectedDoctorId === doc._id} />
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <Paragraph className="text-center text-gray-500">Không tìm thấy bác sĩ.</Paragraph>
                        </Col>
                    )}
                </Row>
            )}
        </div>
    );
};

export default ChooseDoctor;
