import { Button, Input, message, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { formatDateDDMMYYYY } from "../../utils/date";
import {
    getInvoices,
    type Invoice,
    type InvoiceMeta,
    type InvoiceStatus
} from "../../services/InvoiceService";

const formatGender = (gender: 'male' | 'female' | 'other'): string => {
    switch (gender) {
        case 'male': return 'Nam';
        case 'female': return 'Nữ';
        default: return 'Khác';
    }
}

const InvoiceManagement = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [meta, setMeta] = useState<InvoiceMeta | null>(null);

    // table query state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<string | undefined>(undefined);
    const [q, setQ] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, [page, pageSize, sort, q]);

    // Hàm lấy danh sách hóa đơn từ API
    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const { items, meta } = await getInvoices({ page, limit: pageSize, sort, q });
            setInvoices(items);
            setMeta(meta);
            return items;
        }
        catch (error) {
            message.error("Lỗi khi lấy danh sách hóa đơn");
            return [];
        } finally {
            setLoading(false);
        }
    }

    // Hàm ánh xạ status sang màu sắc hiển thị
    const getStatusTag = (status: InvoiceStatus) => {
        let color;
        let statusText;
        switch (status) {
            case 'Paid':
                color = 'green';
                statusText = 'Đã thanh toán';
                break;
            case 'Cancelled':
                color = 'red';
                statusText = 'Đã hủy';
                break;
            case 'Refunded':
                color = 'volcano';
                statusText = 'Đã hoàn tiền';
                break;
            case 'Pending':
            default:
                color = 'gold';
                statusText = 'Chờ thanh toán';
                break;
        }
        return <Tag color={color}>{statusText}</Tag>;
    };

    // Hàm xử lý thay đổi của Table (phân trang, sắp xếp)
    const handleTableChange = (
        pagination: { current?: number; pageSize?: number },
        _filters: any,
        sorter: any
    ) => {
        // pagination
        if (pagination.current) setPage(pagination.current);
        if (pagination.pageSize) setPageSize(pagination.pageSize);

        // sorting logic 
        if (Array.isArray(sorter)) {
            sorter = sorter[0];
        }
        if (sorter && sorter.field) {
            const field = sorter.field as string;
            const order = sorter.order as 'ascend' | 'descend' | undefined;
            if (order === 'ascend') setSort(field);
            else if (order === 'descend') setSort(`-${field}`);
            else setSort(undefined);
        } else {
            setSort(undefined);
        }
    };

    const onSearch = () => {
        setPage(1);
        setQ(searchInput.trim());
    };

    // Định nghĩa các cột cho Table Quản lý Hóa đơn
    const columns = [
        {
            title: 'Mã HĐ',
            dataIndex: '_id',
            key: '_id',
            width: 120,
            render: (value: string) => value.slice(0, 8)
        },
        {
            title: 'Chủ Hồ sơ Sức khỏe',
            dataIndex: ['owner_detail', 'name'],
            key: 'ownerName',
            render: (_: any, record: Invoice) => (
                <>
                    <strong className="block">{record.owner_detail?.name}</strong>
                    <small className="block">SĐT: {record.owner_detail?.phone}</small>
                </>
            )
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            sorter: true,
            render: getStatusTag
        },
        {
            title: 'Tổng tiền (VNĐ)',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            sorter: true,
            align: 'right' as const,
            render: (value: number) => value.toLocaleString('vi-VN')
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: true,
            width: 120,
            render: (value: string) => formatDateDDMMYYYY(value)
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Quản lý Hóa đơn</h1>
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div style={{ minWidth: 240, width: '100%', maxWidth: 420 }}>
                    <Input.Search
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Tìm kiếm ..."
                        allowClear
                        enterButton={
                            <Button icon={<FaSearch />}
                                style={{
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white',
                                    borderColor: 'var(--color-primary)'
                                }} >
                                Tìm
                            </Button>}
                        className='text-[var(--color-primary)]'
                        onSearch={onSearch}
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={invoices}
                rowKey={(record) => record._id}
                loading={loading}
                pagination={{
                    current: page,
                    pageSize: pageSize,
                    total: meta?.total ?? invoices.length,
                    showSizeChanger: true,
                    pageSizeOptions: [5, 10, 20, 50],
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} hóa đơn`,
                }}
                onChange={handleTableChange}
                scroll={{ x: 800 }} // Cho phép cuộn ngang nếu màn hình nhỏ
            />
        </div>
    )
}

export default InvoiceManagement;