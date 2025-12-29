import { useEffect, useState } from "react";
import { Table, Card, Typography } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { useAuth } from "../../contexts/AuthContext";
import { getTreatmentsByBooker, type Treatment } from "../../services/TreatmentService";
import type { SorterResult } from "antd/es/table/interface";
import TreatmentDetailModal from "../../components/Patient/TreatmentDetailModal";
import { FaInfoCircle } from "react-icons/fa";
import { MdHealthAndSafety } from "react-icons/md";
import ButtonPrimary from "../../utils/ButtonPrimary";

const { Title, Text } = Typography;

const PatientTreatmentHistory = () => {
    const { user } = useAuth();
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    const [sortField, setSortField] = useState<string>("treatmentDate");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTreatmentId, setSelectedTreatmentId] = useState<string | null>(null);

    useEffect(() => {
        const loadTreatments = async () => {
            if (!user?.id) {
                setTreatments([]);
                setTotal(0);
                return;
            }
            setLoading(true); try {
                const res = await getTreatmentsByBooker(user.id, {
                    page,
                    limit,
                    sortBy: sortField,
                    sortOrder,
                });
                setTreatments(res.treatments || []);
                setTotal(res.meta?.total || 0);
            } catch (err) {
                console.error("Error loading treatments:", err);
            } finally {
                setLoading(false);
            }
        };
        loadTreatments();
    }, [user?.id, page, limit, sortField, sortOrder]);

    const handleTableChange = (
        pagination: TablePaginationConfig,
        _filters: any,
        sorter: SorterResult<Treatment> | SorterResult<Treatment>[]
    ) => {
        if (!Array.isArray(sorter) && sorter.order) {
            setSortField(sorter.field as string);
            setSortOrder(sorter.order === "ascend" ? "asc" : "desc");
        }
        if (pagination.current) setPage(pagination.current);
        if (pagination.pageSize) setLimit(pagination.pageSize);
    };

    const columns: ColumnsType<Treatment> = [
        {
            title: "Tên bệnh nhân",
            dataIndex: ["healthProfile", "owner_detail", "name"],
            key: "ownerName",
            render: (_, record) => record.healthProfile?.owner_detail?.name || "—",
        },
        {
            title: "Bác sĩ",
            dataIndex: ["doctor", "name"],
            key: "doctorName",
            render: (_, record) => record.doctor?.name || "—",
        },
        {
            title: "Chuyên khoa",
            dataIndex: ["doctor", "specialtyId", "name"],
            key: "specialty",
            render: (_, record) => record.doctor?.specialtyId?.name || "—",
        },
        {
            title: "Ngày khám",
            dataIndex: "treatmentDate",
            key: "treatmentDate",
            render: (text) => dayjs.utc(text).format("DD/MM/YYYY"),
            sorter: true,
            defaultSortOrder: "descend",
        },
        {
            title: "Chuẩn đoán",
            dataIndex: "diagnosis",
            key: "diagnosis",
            ellipsis: true,
            width: "35%",
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (_, record) => (
                <ButtonPrimary type="link" shape="round" icon={<FaInfoCircle />}
                    onClick={() => {
                        setSelectedTreatmentId(record._id);
                        setModalVisible(true);
                    }}>
                    Xem chi tiết
                </ButtonPrimary>
            ),
        },
    ]; return (
        <div className="p-6 container">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Lịch sử ca khám</h1>

            {!loading && treatments.length === 0 ? (
                <Card className="bg-white shadow-md rounded-lg">
                    <div className="text-center py-12">
                        <MdHealthAndSafety style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
                        <Title level={3} type="secondary">Chưa có ca khám nào</Title>
                        <Text type="secondary" className="text-base">
                            Bạn chưa có lịch sử khám bệnh nào. Hãy đặt lịch khám để theo dõi sức khỏe của mình.
                        </Text>
                    </div>
                </Card>
            ) : (
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={treatments}
                    loading={loading}
                    bordered
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: [5, 10, 20, 50],
                        showTotal: (total) => `Tổng ${total} ca khám`,
                    }}
                    onChange={handleTableChange}
                    className="bg-white shadow-md rounded-lg"
                />
            )}

            <TreatmentDetailModal
                visible={modalVisible}
                treatmentId={selectedTreatmentId ?? undefined}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedTreatmentId(null);
                }}
            />
        </div>
    );
};

export default PatientTreatmentHistory;
