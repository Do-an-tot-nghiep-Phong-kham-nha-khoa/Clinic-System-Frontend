import { Card, Col, Row, message, Skeleton, Typography } from "antd";
import { useEffect, useState } from "react";
import { FaUserMd } from "react-icons/fa";
import { getSpecialties, type Specialty } from "../../../services/SpecialtyService";

const { Title, Paragraph } = Typography;

type ChooseSpecialtyProps = {
    // Callback để component cha biết chuyên khoa nào đã được chọn
    onNext: (specialtyId: string) => void;
    selectedSpecialtyId: string | null;
    disabled?: boolean;
};

const ChooseSpecialty: React.FC<ChooseSpecialtyProps> = ({ onNext, selectedSpecialtyId, disabled }) => {
    const [specialties, setSpecialties] = useState<Specialty[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSpecialties();
    }, []);

    const fetchSpecialties = async () => {
        try {
            setLoading(true);
            const data = await getSpecialties();
            setSpecialties(data);
        } catch (error) {
            message.error("Lỗi khi lấy danh sách chuyên khoa.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSpecialty = (specialtyId: string) => {
        if (!disabled) {
            onNext(specialtyId);
        }
    };

    return (
        <div className="p-4">
            <Title level={3} className="mb-4">1. Chọn Chuyên Khoa</Title>

            {loading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
                <Row gutter={[16, 16]}>
                    {specialties.length > 0 ? (
                        specialties.map((specialty) => (
                            <Col xs={24} sm={12} md={8} key={specialty._id}>
                                <Card
                                    title={
                                        <div className="flex items-center gap-2">
                                            <FaUserMd className="text-lg text-blue-500" />
                                            {specialty.name}
                                        </div>
                                    }
                                    hoverable
                                    className={`
                                        transition-all duration-200 
                                        ${selectedSpecialtyId === specialty._id
                                            ? 'border-4 border-blue-500 shadow-lg'
                                            : 'border-gray-200'
                                        }
                                    `}
                                    onClick={() => handleSelectSpecialty(specialty._id)}
                                >
                                    <Paragraph ellipsis={{ rows: 2, expandable: false }}>
                                        {specialty.description}
                                    </Paragraph>
                                    <Paragraph className="mt-2 font-semibold text-blue-500">
                                        {selectedSpecialtyId === specialty._id ?
                                            <p className="!text-blue-500">Đã chọn</p>
                                            : 'Chọn khám'}
                                    </Paragraph>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <Paragraph className="text-center text-gray-500">
                                Không tìm thấy chuyên khoa nào.
                            </Paragraph>
                        </Col>
                    )}
                </Row>
            )}
        </div>
    );
};

export default ChooseSpecialty;