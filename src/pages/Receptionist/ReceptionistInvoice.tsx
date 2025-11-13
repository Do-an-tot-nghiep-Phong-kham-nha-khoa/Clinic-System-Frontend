import { Button, Input, message, Table, Tag, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import { FaSearch, FaRegEdit } from "react-icons/fa";
import { formatDateDDMMYYYY } from "../../utils/date";
import {
    getInvoiceById,
    getInvoices,
    type Invoice,
    type InvoiceMeta,
    type InvoiceStatus,
    updateInvoiceStatus,
} from "../../services/InvoiceService";
import ButtonPrimary from "../../utils/ButtonPrimary";

const formatGender = (gender: 'male' | 'female' | 'other'): string => {
    switch (gender) {
        case 'male': return 'Nam';
        case 'female': return 'Nữ';
        default: return 'Khác';
    }
}

const ReceptionistInvoice = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [meta, setMeta] = useState<InvoiceMeta | null>(null);

    // table query state
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sort, setSort] = useState<string | undefined>(undefined);
    const [q, setQ] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [loading, setLoading] = useState(false);

    const [statusOpen, setStatusOpen] = useState(false);
    const [statusSaving, setStatusSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);
    const [currentStatus, setCurrentStatus] = useState<InvoiceStatus | undefined>(undefined);
    const [allowedStatuses, setAllowedStatuses] = useState<InvoiceStatus[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | undefined>(undefined);

    const [invoiceDetailOpen, setInvoiceDetailOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [detailLoading, setDetailLoading] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, [page, pageSize, sort, q]);

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

    const computeAllowedStatuses = (status: InvoiceStatus): InvoiceStatus[] => {
        if (status === 'Pending') return ['Paid', 'Cancelled'];
        if (status === 'Paid') return ['Refunded'];
        return []; // Cancelled, Refunded -> no further transitions
    };

    const openStatusModal = (invoice: Invoice) => {
        const options = computeAllowedStatuses(invoice.status);
        if (options.length === 0) return; // should be disabled already
        setEditingId(invoice._id);
        setCurrentStatus(invoice.status);
        setAllowedStatuses(options);
        setSelectedStatus(options[0]);
        setStatusOpen(true);
    };

    const handleSaveStatus = async () => {
        if (!editingId || !selectedStatus) return;
        try {
            setStatusSaving(true);
            await updateInvoiceStatus(editingId, { status: selectedStatus });
            message.success('Cập nhật trạng thái hóa đơn thành công');
            setStatusOpen(false);
            fetchInvoices();
        } catch (e) {
            message.error('Cập nhật trạng thái thất bại');
        } finally {
            setStatusSaving(false);
        }
    };

    const handleTableChange = (
        pagination: { current?: number; pageSize?: number },
        _filters: any,
        sorter: any
    ) => {
        if (pagination.current) setPage(pagination.current);
        if (pagination.pageSize) setPageSize(pagination.pageSize);

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

    const handlePrintInvoice = async (invoiceId: string) => {
        try {
            setDetailLoading(true);
            const invoice = await getInvoiceById(invoiceId);
            setSelectedInvoice(invoice);
            setInvoiceDetailOpen(true);
        } catch (error) {
            message.error("Không thể lấy chi tiết hóa đơn.");
        } finally {
            setDetailLoading(false);
        }
    };

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
        {
            title: 'Hành động',
            key: 'actions',
            width: 140,
            render: (_: any, record: Invoice) => (
                <div className="flex gap-2 justify-end">
                    <ButtonPrimary
                        type="primary"
                        icon={<FaRegEdit />}
                        disabled={record.status === 'Cancelled' || record.status === 'Refunded'}
                        onClick={() => openStatusModal(record)}
                    >
                        Sửa trạng thái
                    </ButtonPrimary>

                    <Button
                        type="default" // Có thể dùng type="ghost" hoặc type="default"
                        onClick={() => handlePrintInvoice(record._id)} // Tạo hàm xử lý mới
                    >
                        In HĐ
                    </Button>
                </div>
            )
        }
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
                scroll={{ x: 800 }}
            />
            <Modal
                title="Cập nhật trạng thái hóa đơn"
                open={statusOpen}
                onCancel={() => setStatusOpen(false)}
                onOk={handleSaveStatus}
                confirmLoading={statusSaving}
                okText="Lưu"
                cancelText="Hủy"
                destroyOnClose
            >
                <div className="flex flex-col gap-3">
                    <div>
                        <span className="text-sm text-gray-600">Trạng thái hiện tại:</span>
                        <div className="mt-1">{currentStatus && (<> {getStatusTag(currentStatus)} </>)}</div>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600">Chọn trạng thái mới:</span>
                        <Select
                            className="w-full mt-1"
                            value={selectedStatus}
                            onChange={(val: InvoiceStatus) => setSelectedStatus(val)}
                            options={allowedStatuses.map(s => ({ label: s, value: s }))}
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                title={`Chi tiết Hóa đơn: ${selectedInvoice?._id.slice(0, 8)}`}
                open={invoiceDetailOpen}
                onCancel={() => {
                    setInvoiceDetailOpen(false);
                    setSelectedInvoice(null);
                }}
                footer={[
                    <Button key="back" onClick={() => setInvoiceDetailOpen(false)}>
                        Đóng
                    </Button>,
                    <Button key="print" type="primary" onClick={() => window.print()} disabled={!selectedInvoice}>
                        In Hóa đơn
                    </Button>,
                ]}
                width={800}
                // Dùng kỹ thuật in cho Modal Antd
                // Tạo một ID cho nội dung cần in
                getContainer={() => document.getElementById('invoice-print-container') || document.body}
                destroyOnClose
            >
                {detailLoading ? (
                    <div>Đang tải...</div>
                ) : (
                    selectedInvoice && (
                        <div id="invoice-print-content" className="p-4">
                            {/* 1. Thông tin Chung & Chủ HSSK */}
                            <h2 className="text-xl font-bold mb-3 border-b pb-1">THÔNG TIN HÓA ĐƠN</h2>
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                    <p><strong>Mã HĐ:</strong> {selectedInvoice._id.slice(0, 8)}</p>
                                    <p><strong>Ngày tạo:</strong> {formatDateDDMMYYYY(selectedInvoice.created_at)}</p>
                                    <p><strong>Tổng tiền:</strong> {selectedInvoice.totalPrice.toLocaleString('vi-VN')} VNĐ</p>
                                    <p><strong>Trạng thái:</strong> {getStatusTag(selectedInvoice.status)}</p>
                                </div>
                                <div>
                                    <p><strong>Chủ HSSK:</strong> {selectedInvoice.owner_detail.name}</p>
                                    <p><strong>SĐT:</strong> {selectedInvoice.owner_detail.phone}</p>
                                    <p><strong>Ngày sinh:</strong> {formatDateDDMMYYYY(selectedInvoice.owner_detail.dob)}</p>
                                    <p><strong>Giới tính:</strong> {formatGender(selectedInvoice.owner_detail.gender)}</p>
                                </div>
                            </div>

                            {/* 2. Chi tiết Dịch vụ (Lab Order) */}
                            {selectedInvoice.labOrder && selectedInvoice.labOrder.items.length > 0 && (
                                <>
                                    <h3 className="text-lg font-semibold mt-4 mb-2 border-b pb-1">DỊCH VỤ SỬ DỤNG (XÉT NGHIỆM)</h3>
                                    <Table
                                        columns={[
                                            { title: 'Tên Dịch vụ', dataIndex: ['service', 'name'], key: 'serviceName' },
                                            { title: 'Giá', dataIndex: ['service', 'price'], key: 'servicePrice', align: 'right' as const, render: (v: number) => v.toLocaleString('vi-VN') + ' VNĐ' },
                                        ]}
                                        dataSource={selectedInvoice.labOrder.items}
                                        pagination={false}
                                        rowKey="_id"
                                        size="small"
                                    />
                                    <p className="text-right mt-2 font-bold">
                                        Tổng tiền Dịch vụ: {selectedInvoice.labOrder.totalPrice.toLocaleString('vi-VN')} VNĐ
                                    </p>
                                </>
                            )}

                            {/* 3. Chi tiết Thuốc (Prescription) */}
                            {selectedInvoice.prescription && selectedInvoice.prescription.items.length > 0 && (
                                <>
                                    <h3 className="text-lg font-semibold mt-4 mb-2 border-b pb-1">ĐƠN THUỐC</h3>
                                    <Table
                                        columns={[
                                            { title: 'Tên Thuốc', dataIndex: ['medicine', 'name'], key: 'medicineName' },
                                            { title: 'Giá', dataIndex: ['medicine', 'price'], key: 'medicinePrice', align: 'right' as const, render: (v: number) => v.toLocaleString('vi-VN') + ' VNĐ' },
                                        ]}
                                        dataSource={selectedInvoice.prescription.items}
                                        pagination={false}
                                        rowKey="_id"
                                        size="small"
                                    />
                                    <p className="text-right mt-2 font-bold">
                                        Tổng tiền Thuốc: {selectedInvoice.prescription.totalPrice.toLocaleString('vi-VN')} VNĐ
                                    </p>
                                </>
                            )}

                            <h3 className="text-xl font-bold mt-4 pt-2 border-t text-right">
                                TỔNG THANH TOÁN: {selectedInvoice.totalPrice.toLocaleString('vi-VN')} VNĐ
                            </h3>
                        </div>
                    )
                )}
            </Modal>
        </div>
    )
}

export default ReceptionistInvoice;