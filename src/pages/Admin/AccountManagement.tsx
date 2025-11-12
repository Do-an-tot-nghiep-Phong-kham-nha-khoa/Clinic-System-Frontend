import { useEffect, useState } from "react";
import { Table, Input, message, Tabs, Button, Modal } from "antd";
import { FaSearch, FaTrash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { AiFillEdit } from "react-icons/ai";
import { getAccounts, deleteAccount } from "../../services/AccountService";
import type { Account } from "../../services/AccountService";
import ButtonPrimary from "../../utils/ButtonPrimary";
import ModalCreateAccount from "../../components/Admin/ModalCreateAccount";
import ModalEditAccount from "../../components/Admin/ModalEditAccount";
import { formatDateDDMMYYYY } from "../../utils/date";

const { TabPane } = Tabs;

const AccountManagement = () => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");

    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | undefined>(undefined);

    // Load accounts once
    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const { items } = await getAccounts();
            setAccounts(items);
        } catch (err) {
            message.error("Lỗi khi lấy danh sách tài khoản");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleDelete = async (id: string) => {
        Modal.confirm({
            title: "Xoá tài khoản",
            content: "Bạn có chắc muốn xoá tài khoản này? Hành động này không thể hoàn tác.",
            okText: "Xoá",
            okType: "danger",
            cancelText: "Huỷ",
            onOk: async () => {
                try {
                    await deleteAccount(id);
                    message.success("Xoá tài khoản thành công");
                    fetchAccounts();
                } catch {
                    message.error("Xoá tài khoản thất bại");
                }
            },
        });
    };

    const openEditModal = (id: string) => {
        setEditingId(id);
        setEditOpen(true);
    };

    // Table columns
    const columns = [
        { title: "Email", dataIndex: "email", key: "email" },
        { title: "Role", dataIndex: ["roleId", "name"], key: "role", render: (name: string) => name || "Người dùng" },
        { title: "Status", dataIndex: "status", key: "status" },
        {
            title: "Ngày tạo",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (value: string) => formatDateDDMMYYYY(value),
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Account) => (
                <span className="flex gap-2">
                    <ButtonPrimary type="link" shape="round" icon={<AiFillEdit />} onClick={() => openEditModal(record._id)}>
                        Sửa
                    </ButtonPrimary>
                    <Button type="link" danger shape="round" icon={<FaTrash />} onClick={() => handleDelete(record._id)}>
                        Xoá
                    </Button>
                </span>
            ),
        },
    ];

    // Filter accounts by role
    const filterByRole = (roleName: string) => {
        return accounts.filter(acc => acc.roleId && acc.roleId.name === roleName);
    };


    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Quản lý tài khoản</h1>

            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <ButtonPrimary icon={<MdAdd />} size="large" onClick={() => setCreateOpen(true)}>
                    Thêm tài khoản
                </ButtonPrimary>
                <Input.Search
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Tìm kiếm tài khoản..."
                    allowClear
                    enterButton={<Button icon={<FaSearch />}>Search</Button>}
                />
            </div>

            <Tabs
                defaultActiveKey="user"
                items={[
                    {
                        key: 'user',
                        label: 'User',
                        children: (
                            <Table
                                columns={columns}
                                dataSource={filterByRole("patient")}
                                rowKey={record => record._id!}
                                loading={loading}
                            />
                        ),
                    },
                    {
                        key: 'receptionist',
                        label: 'Receptionist',
                        children: (
                            <Table
                                columns={columns}
                                dataSource={filterByRole("receptionist")}
                                rowKey={record => record._id!}
                                loading={loading}
                            />
                        ),
                    },
                    {
                        key: 'doctor',
                        label: 'Doctor',
                        children: (
                            <Table
                                columns={columns}
                                dataSource={filterByRole("doctor")}
                                rowKey={record => record._id!}
                                loading={loading}
                            />
                        ),
                    },
                    {
                        key: 'admin',
                        label: 'Admin',
                        children: (
                            <Table
                                columns={columns}
                                dataSource={filterByRole("admin")}
                                rowKey={record => record._id!}
                                loading={loading}
                            />
                        ),
                    },
                ]}
            />


            <ModalCreateAccount
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                onCreated={() => fetchAccounts()}
            />

            <ModalEditAccount
                open={editOpen}
                id={editingId}
                onClose={() => { setEditOpen(false); setEditingId(undefined); }}
                onUpdated={() => fetchAccounts()}
            />
        </div>
    );
};

export default AccountManagement;
