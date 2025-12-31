import { useEffect, useState } from "react";
import { Table, message, Card, Typography, Button, Tag, Space, Modal } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { useAuth } from "../../contexts/AuthContext";
import { getInvoicesByPatient, createVNPayPayment } from "../../services/InvoiceService";
import { FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { MdOutlineReceiptLong } from "react-icons/md";
import ButtonPrimary from "../../utils/ButtonPrimary";

const { Title, Text } = Typography;

interface Invoice {
    _id: string;
    totalPrice: number;
    status: "Pending" | "Paid" | "Cancelled" | "Refunded";
    issued_at: string;
    invoiceNumber?: string;
    payments?: Array<{
        method?: string;
        paid_at?: string;
        status?: string;
        provider?: string;
    }>;
    healthProfile_id?: {
        _id?: string;
        ownerId?: string;
        ownerModel?: string;
    };
    treatmentId?: any;
}

const PatientInvoices = () => {
    const { user } = useAuth();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        loadInvoices();
    }, [user?.id, page, limit]);

    const loadInvoices = async () => {
        if (!user?.id) {
            setInvoices([]);
            setTotal(0);
            return;
        }
        setLoading(true);
        try {
            const res = await getInvoicesByPatient({
                id: user.id,
                page,
                limit,
            });
            setInvoices(res.data as any || []);
            setTotal(res.data?.length || 0);
        } catch (err) {
            console.error("Error loading invoices:", err);
            setInvoices([]);
            setTotal(0);
            if (err && typeof err === 'object' && 'response' in err) {
                message.error("Không thể tải dữ liệu hóa đơn");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination: TablePaginationConfig) => {
        if (pagination.current) setPage(pagination.current);
        if (pagination.pageSize) setLimit(pagination.pageSize);
    };

    const handleCashPayment = () => {
        Modal.confirm({
            title: "Xác nhận thanh toán tiền mặt",
            content: "Bạn sẽ thanh toán tiền mặt tại quầy. Vui lòng đến quầy thu ngân để hoàn tất thanh toán.",
            okText: "Đã hiểu",
            cancelText: "Hủy",
            onOk() {
                message.success("Vui lòng đến quầy thu ngân để thanh toán");
            },
        });
    };

    const handleVNPayPayment = async (invoiceId: string) => {
        console.log("=== handleVNPayPayment called ===");
        console.log("Invoice ID:", invoiceId);
        
        setPaymentLoading(invoiceId);
        try {
            // Không gửi returnUrl, để backend tự xử lý
            console.log("Calling createVNPayPayment...");
            
            const res = await createVNPayPayment(invoiceId);
            console.log("VNPay response:", res);
            
            if (res.checkoutUrl) {
                console.log("Redirecting to:", res.checkoutUrl);
                // Redirect to VNPay checkout
                window.location.href = res.checkoutUrl;
            } else {
                console.error("No checkoutUrl in response");
                message.error("Không nhận được đường dẫn thanh toán");
            }
        } catch (err: any) {
            console.error("Error creating VNPay payment:", err);
            console.error("Error response:", err?.response);
            message.error(err?.response?.data?.message || "Không thể tạo thanh toán VNPay");
        } finally {
            setPaymentLoading(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid":
                return "green";
            case "Pending":
                return "orange";
            case "Cancelled":
                return "red";
            default:
                return "default";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "Paid":
                return "Đã thanh toán";
            case "Pending":
                return "Chờ thanh toán";
            case "Cancelled":
                return "Đã hủy";
            default:
                return status;
        }
    };

    const columns: ColumnsType<Invoice> = [
        {
            title: "Số hóa đơn",
            dataIndex: "invoiceNumber",
            key: "invoiceNumber",
            render: (text) => text || "—",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            render: (price) => `${price?.toLocaleString() || 0} VNĐ`,
            align: "right",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status) => (
                <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
            ),
            align: "center",
        },
        {
            title: "Phương thức",
            key: "payment_method",
            render: (_, record) => {
                const payment = record.payments?.[0];
                if (!payment?.method) return "—";
                return payment.method === "cash" ? "Tiền mặt" : payment.method === "vnpay" ? "VNPay" : payment.method;
            },
            align: "center",
        },
        {
            title: "Ngày tạo",
            dataIndex: "issued_at",
            key: "issued_at",
            render: (text) => text ? dayjs.utc(text).format("DD/MM/YYYY HH:mm") : "—",
        },
        {
            title: "Ngày thanh toán",
            key: "paid_at",
            render: (_, record) => {
                const payment = record.payments?.[0];
                return payment?.paid_at ? dayjs.utc(payment.paid_at).format("DD/MM/YYYY HH:mm") : "—";
            },
        },
        {
            title: "Thao tác",
            key: "action",
            align: "center",
            render: (_, record) => {
                if (record.status === "Pending") {
                    return (
                        <Space>
                            <Button
                                type="default"
                                icon={<FaMoneyBillWave />}
                                onClick={() => handleCashPayment()}
                                size="small"
                            >
                                Tiền mặt
                            </Button>
                            <ButtonPrimary
                                icon={<FaCreditCard />}
                                onClick={() => handleVNPayPayment(record._id)}
                                loading={paymentLoading === record._id}
                                size="small"
                            >
                                VNPay
                            </ButtonPrimary>
                        </Space>
                    );
                }
                return "—";
            },
        },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4 text-gray-800">Hóa đơn của tôi</h1>

            {!loading && invoices.length === 0 ? (
                <Card className="bg-white shadow-md rounded-lg">
                    <div className="text-center py-12">
                        <MdOutlineReceiptLong style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
                        <Title level={3} type="secondary">Chưa có hóa đơn nào</Title>
                        <Text type="secondary" className="text-base">
                            Bạn chưa có hóa đơn nào. Hóa đơn sẽ được tạo sau khi khám bệnh.
                        </Text>
                    </div>
                </Card>
            ) : (
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={invoices}
                    loading={loading}
                    bordered
                    pagination={{
                        current: page,
                        pageSize: limit,
                        total,
                        showSizeChanger: true,
                        pageSizeOptions: ["5", "10", "20", "50"],
                        showTotal: (total) => `Tổng ${total} hóa đơn`,
                    }}
                    onChange={handleTableChange}
                    className="bg-white shadow-md rounded-lg"
                />
            )}
        </div>
    );
};

export default PatientInvoices;
